export interface RecipeDto {
  id: number
  title: string
  description: string
  imageUrl: string
  videoUrl: string
  categoryId: number
  categoryName: string
  userId: number
  userFullName: string
  createdAt: string
  totalCalories: number
  totalProteins: number
  totalFats: number
  totalCarbs: number
  ingredients: RecipeProductDto[]
  isSaved: boolean
  cookingTime: number // Час приготування в хвилинах
  servings: number // Кількість порцій
}

export interface RecipeProductDto {
  id: number
  productId: number
  productName: string
  amountGrams: number
  calories: number
  proteins: number
  fats: number
  carbs: number
}

export interface RecipeProductCreateDto {
  productId: number
  amountGrams: number
}

export interface RecipeCreateDto {
  title: string
  description: string
  imageUrl: string
  videoUrl: string
  categoryId: number
  ingredients: RecipeProductCreateDto[]
  cookingTime: number // Час приготування в хвилинах
  servings: number // Кількість порцій
}

export interface RecipeUpdateDto extends RecipeCreateDto {}
