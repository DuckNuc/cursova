import type React from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import type { RecipeProductDto } from "../../types/recipe"

interface IngredientsListProps {
  ingredients: RecipeProductDto[]
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <View style={styles.ingredientInfo}>
              <Text style={styles.ingredientName}>{item.productName}</Text>
              <Text style={styles.ingredientAmount}>{item.amountGrams}g</Text>
            </View>
            <View style={styles.nutritionInfo}>
              <Text style={styles.nutritionText}>{Math.round(item.calories)} kcal</Text>
            </View>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  ingredientAmount: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  nutritionInfo: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  nutritionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
})

export default IngredientsList
