export interface ProductDto {
  id: number
  name: string
  categoryId: number
  categoryName: string
  caloriesPer100g: number
  proteinsPer100g: number
  fatsPer100g: number
  carbsPer100g: number
}

export interface ProductCreateDto {
  name: string
  categoryId: number
  caloriesPer100g: number
  proteinsPer100g: number
  fatsPer100g: number
  carbsPer100g: number
}

export interface ProductUpdateDto extends ProductCreateDto {}
