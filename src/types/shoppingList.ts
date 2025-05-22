export interface ShoppingListDto {
  id: number
  name: string
  userId: number
  createdAt: string
  items: ShoppingListItemDto[]
}

export interface ShoppingListItemDto {
  id: number
  productId: number
  productName: string
  amount: number
  unit: string
  isChecked: boolean
}

export interface ShoppingListCreateDto {
  name: string
  items: ShoppingListItemCreateDto[]
}

export interface ShoppingListItemCreateDto {
  productId: number
  amount: number
  unit: string
}

export interface ShoppingListUpdateDto {
  name: string
  items: ShoppingListItemCreateDto[]
}

export interface ShoppingListItemUpdateDto {
  id: number
  isChecked: boolean
}
