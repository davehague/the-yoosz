// services/PersistentDataService.ts
import { supabase } from "@/utils/supabaseClient";
import { type User, type Memory } from "@/types/interfaces";

export default class PersistentDataService {
  // ============= GENERAL ============= //
  static async multiRecordFetch(tableName: string) {
    console.log("Getting multiple records from", tableName);
    const query = supabase.from(tableName).select("*");
    const { data, error } = await query;
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }

    return data;
  }

  static async singleRecordFetch(tableName: string, recordId: string) {
    const query = supabase.from(tableName).select("*").eq("id", recordId);
    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }

    return data.length > 0 ? data[0] : null;
  }

  // ============= Login ============= //
  static async fetchUserByEmail(email: string): Promise<User | null> {
    const query = supabase.from("users").select("*").eq("email", email);
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }

    return data.length > 0 ? data[0] : null;
  }

  static async updateLastLogin(userId: string) {
    const query = supabase
      .from("users")
      .update({ last_login: new Date() })
      .eq("id", userId)
      .select();
    const { data, error } = await query;

    if (error) {
      console.error("Error updating last login:", error);
      throw error;
    }

    return data.length > 0 ? data[0] : null;
  }

  // ============= Tags ============= //
  static async getTagsForCategory(category: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("memories")
      .select("tags")
      .ilike("category", category);

    if (error) {
      console.error("Error fetching tags for category:", error);
      throw error;
    }

    // Flatten the array of tag arrays and remove duplicates
    const uniqueTags = Array.from(
      new Set(data.flatMap((item) => item.tags || []))
    );
    return uniqueTags;
  }

  // ============= Memories ============= //
  static async addMemory(
    memory: Omit<Memory, "id" | "createdAt" | "updatedAt">
  ): Promise<Memory> {
    const { data, error } = await supabase
      .from("memories")
      .insert({
        title: memory.title,
        category: memory.category,
        tags: memory.tags,
        rating: memory.rating,
        notes: memory.notes,
        url: memory.url,
        location: memory.location,
        // Let the database handle created_at and updated_at
      })
      .select();

    if (error) {
      console.error("Error adding memory:", error);
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error("No data returned after inserting memory");
    }
    return this.mapDbMemoryToMemory(data[0]);
  }

  static async updateMemory(
    id: string,
    updates: Partial<Memory>
  ): Promise<Memory> {
    const { data, error } = await supabase
      .from("memories")
      .update({
        title: updates.title,
        category: updates.category,
        tags: updates.tags,
        rating: updates.rating,
        notes: updates.notes,
        url: updates.url,
        location: updates.location,
        // Let the database handle updated_at
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating memory:", error);
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error("No data returned after updating memory");
    }
    return this.mapDbMemoryToMemory(data[0]);
  }

  static async deleteMemory(id: string): Promise<void> {
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (error) {
      console.error("Error deleting memory:", error);
      throw error;
    }
  }

  static async getMemoryById(id: string): Promise<Memory | null> {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching memory by id:", error);
      throw error;
    }

    return data ? this.mapDbMemoryToMemory(data) : null;
  }

  static async getAllMemories(): Promise<Memory[]> {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all memories:", error);
      throw error;
    }

    return data.map(this.mapDbMemoryToMemory);
  }

  private static mapDbMemoryToMemory(dbMemory: any): Memory {
    return {
      id: dbMemory.id,
      title: dbMemory.title,
      category: dbMemory.category,
      tags: dbMemory.tags,
      rating: dbMemory.rating,
      notes: dbMemory.notes,
      url: dbMemory.url,
      location: dbMemory.location,
      createdAt: dbMemory.created_at
        ? new Date(dbMemory.created_at)
        : new Date(),
      updatedAt: dbMemory.updated_at
        ? new Date(dbMemory.updated_at)
        : new Date(),
    };
  }
}
