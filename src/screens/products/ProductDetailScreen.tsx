"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { type RouteProp, useRoute } from "@react-navigation/native"
import type { ProductsStackParamList } from "../../navigation/ProductsNavigator"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { ProductDto } from "../../types/product"
import NutritionInfo from "../../components/recipes/NutritionInfo"

type ProductDetailScreenRouteProp = RouteProp<ProductsStackParamList, "ProductDetail">

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>()
  const { showToast } = useToast()
  const { productId } = route.params
  const [product, setProduct] = useState<ProductDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/api/Products/${productId}`)
      setProduct(response.data)
    } catch (error) {
      console.error("Error fetching product:", error)
      showToast("Failed to load product details", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [productId])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.category}>Category: {product.categoryName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition Information (per 100g)</Text>
        <NutritionInfo
          calories={product.caloriesPer100g}
          proteins={product.proteinsPer100g}
          fats={product.fatsPer100g}
          carbs={product.carbsPer100g}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Nutrition</Text>
        <View style={styles.nutritionDetail}>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Calories:</Text>
            <Text style={styles.nutritionValue}>{product.caloriesPer100g.toFixed(1)} kcal</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Proteins:</Text>
            <Text style={styles.nutritionValue}>{product.proteinsPer100g.toFixed(1)} g</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Fats:</Text>
            <Text style={styles.nutritionValue}>{product.fatsPer100g.toFixed(1)} g</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Carbohydrates:</Text>
            <Text style={styles.nutritionValue}>{product.carbsPer100g.toFixed(1)} g</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  nutritionDetail: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nutritionLabel: {
    fontSize: 16,
    color: "#333",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
})

export default ProductDetailScreen
