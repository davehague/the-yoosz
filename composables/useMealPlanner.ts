// composables/useMealPlanner.ts
import type { Memory } from '~/types/interfaces'
import PersistentDataService from '~/services/PersistentDataService';

interface EmailApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const useMealPlanner = () => {
  const createAndSendMealPlan = async () => {
    console.log("Generating new meal plan...")
    
    const memories = await PersistentDataService.getAllMemories();
    const recipes = memories.filter(memory => memory.category === 'Recipes')
    
    const mealPlan = {
      singleServeMeal: getRandomRecipeByTag(recipes, 'single serve meals'),
      soupAndSalad: getRandomRecipeByTag(recipes, 'soup and salad'),
      sheetpanGrillAndSide: getRandomRecipeByTag(recipes, 'sheetpan grill and side'),
      sideDish: getRandomRecipeByTag(recipes, 'side dish'),
      heartyWarmMeal: getRandomRecipeByTag(recipes, 'hearty warm meals'),
      valGal: getRandomRecipeByTag(recipes, 'val gal'),
      valGalSides: getRandomRecipeByTag(recipes, 'val gal sides'),
    }

    console.log("Meal plan generated. Sending email...")

    // Send email with the new meal plan
    await sendMealPlanEmail(mealPlan)

    return mealPlan
  }

  const getRandomRecipeByTag = (recipes: Memory[], tag: string): Memory | null => {
    const filteredRecipes = recipes.filter(recipe => recipe.tags?.includes(tag))
    if (filteredRecipes.length === 0) return null
    return filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)]
  }

  const sendMealPlanEmail = async (mealPlan: any) => {
    const htmlTemplate = `
      <strong>Hello, here is your meal plan for the week:</strong>
      <ul style="padding-left: 8px">
        <li><strong>Single Serve Meals:</strong> ${mealPlan.singleServeMeal?.title || 'Not available'}</li>
        <li><strong>Soup And Salad:</strong> ${mealPlan.soupAndSalad?.title || 'Not available'}</li>
        <li><strong>Sheetpan Grill And Side:</strong> ${mealPlan.sheetpanGrillAndSide?.title || 'Not available'}</li>
        <li><strong>Side Dish:</strong> ${mealPlan.sideDish?.title || 'Not available'}</li>
        <li><strong>Hearty Warm Meals:</strong> ${mealPlan.heartyWarmMeal?.title || 'Not available'}</li>
        <li><strong>Val Gal:</strong> ${mealPlan.valGal?.title || 'Not available'}</li>
        <li><strong>Val Gal Sides:</strong> ${mealPlan.valGalSides?.title || 'Not available'}</li>
      </ul>
    `

    try {
      const response = await $fetch<EmailApiResponse>('/api/sendEmail', {
        method: 'POST',
        body: {
          toEmail: 'david.hague@gmail.com', 
          subject: 'Your Weekly Meal Plan from the Yoosz',
          htmlTemplate,
        },
      })

      if (response.success) {
        console.log('Meal plan email sent successfully')
      } else {
        console.error('Failed to send meal plan email:', response.message)
      }
    } catch (error) {
      console.error('Error sending meal plan email:', error)
    }
  }

  return {
    createAndSendMealPlan,
  }
}