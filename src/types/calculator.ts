export interface ProductAmountDto {
  productId: number
  amountGrams: number
}

export interface NutritionResultDto {
  totalCalories: number
  totalProteins: number
  totalFats: number
  totalCarbs: number
}

export interface ManualCalorieCalculationDto {
  proteins: number
  fats: number
  carbs: number
}
