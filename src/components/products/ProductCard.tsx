import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ProductDto } from "../../types/product"

interface ProductCardProps {
  product: ProductDto
  onPress: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name="nutrition" size={24} color="#FF6B6B" />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>{product.categoryName}</Text>
      </View>

      <View style={styles.nutritionContainer}>
        <Text style={styles.calories}>{Math.round(product.caloriesPer100g)} kcal</Text>
        <Text style={styles.perUnit}>per 100g</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  nutritionContainer: {
    alignItems: "flex-end",
  },
  calories: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  perUnit: {
    fontSize: 12,
    color: "#666",
  },
})

export default ProductCard
