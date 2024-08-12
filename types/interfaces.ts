export type User = {
  id: string;
  email: string;
};

export type Memory = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  rating: number;
  notes: string;
  url?: string;
  location?: {
    lat?: number;
    lng?: number;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}