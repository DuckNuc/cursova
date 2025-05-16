"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { ProductDto } from "../../types/product"
import type { NutritionResultDto, ProductAmountDto } from "../../types/calculator"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"
import NutritionInfo from "../../components/recipes/NutritionInfo"
import ProductSelector from "../../components/calculator/ProductSelector"

const CalorieCalculatorScreen = () => {
  const { showToast } = useToast()
  const [products, setProducts] = useState<ProductDto[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductAmountDto[]>([])
  const [nutritionResult, setNutritionResult] = useState<NutritionResultDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // Manual calculation fields
  const [proteins, setProteins] = useState("")
  const [fats, setFats] = useState("")
  const [carbs, setCarbs] = useState("")
  const [activeTab, setActiveTab] = useState<"products" | "manual">("products")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/api/Products")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      showToast("Failed to load products", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = () => {
    if (products.length === 0) {
      showToast("No products available", "error")
      return
    }

    setSelectedProducts([...selectedProducts, { productId: products[0].id, amountGrams: 100 }])
  }

  const handleUpdateProduct = (index: number, productId: number, amountGrams: number) => {
    const updatedProducts = [...selectedProducts]
    updatedProducts[index] = { productId, amountGrams }
    setSelectedProducts(updatedProducts)
  }

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...selectedProducts]
    updatedProducts.splice(index, 1)
    setSelectedProducts(updatedProducts)
  }

  const calculateByProducts = async () => {
    if (selectedProducts.length === 0) {
      showToast("Please add at least one product", "error")
      return
    }

    setIsCalculating(true)
    try {
      const response = await api.post("/api/CalorieCalculation/by-products", {
        products: selectedProducts,
      })
      setNutritionResult(response.data)
    } catch (error) {
      console.error("Error calculating nutrition:", error)
      showToast("Failed to calculate nutrition", "error")
    } finally {
      setIsCalculating(false)
    }
  }

  const calculateManually = async () => {
    if (!proteins || !fats || !carbs) {
      showToast("Please fill in all fields", "error")
      return
    }

    setIsCalculating(true)
    try {
      const response = await api.post("/api/CalorieCalculation/manual", {
        proteins: Number.parseFloat(proteins),
        fats: Number.parseFloat(fats),
        carbs: Number.parseFloat(carbs),
      })
      setNutritionResult(response.data)
    } catch (error) {
      console.error("Error calculating nutrition:", error)
      showToast("Failed to calculate nutrition", "error")
    } finally {
      setIsCalculating(false)
    }
  }

  const renderProductsTab = () => (
    <View>
      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>Products</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {selectedProducts.length === 0 ? (
        <Text style={styles.emptyText}>No products added. Tap the + button to add products.</Text>
      ) : (
        selectedProducts.map((item, index) => (
          <ProductSelector
            key={index}
            products={products}
            selectedProductId={item.productId}
            amount={item.amountGrams}
            onProductChange={(productId) => handleUpdateProduct(index, productId, item.amountGrams)}
            onAmountChange={(amount) => handleUpdateProduct(index, item.productId, amount)}
            onRemove={() => handleRemoveProduct(index)}
          />
        ))
      )}

      <Button
        title="Calculate"
        onPress={calculateByProducts}
        isLoading={isCalculating}
        style={styles.calculateButton}
      />
    </View>
  )

  const renderManualTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Manual Calculation</Text>

      <Input
        label="Proteins (g)"
        value={proteins}
        onChangeText={setProteins}
        placeholder="Enter proteins in grams"
        keyboardType="numeric"
      />

      <Input
        label="Fats (g)"
        value={fats}
        onChangeText={setFats}
        placeholder="Enter fats in grams"
        keyboardType="numeric"
      />

      <Input
        label="Carbohydrates (g)"
        value={carbs}
        onChangeText={setCarbs}
        placeholder="Enter carbs in grams"
        keyboardType="numeric"
      />

      <Button title="Calculate" onPress={calculateManually} isLoading={isCalculating} style={styles.calculateButton} />
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calorie Calculator</Text>
        
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "products" && styles.activeTab]}
          onPress={() => setActiveTab("products")}
        >
          <Text style={[styles.tabText, activeTab === "products" && styles.activeTabText]}>By Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "manual" && styles.activeTab]}
          onPress={() => setActiveTab("manual")}
        >
          <Text style={[styles.tabText, activeTab === "manual" && styles.activeTabText]}>Manual</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF6B6B" />
        ) : activeTab === "products" ? (
          renderProductsTab()
        ) : (
          renderManualTab()
        )}

        {nutritionResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Nutrition Result</Text>
            <NutritionInfo
              calories={nutritionResult.totalCalories}
              proteins={nutritionResult.totalProteins}
              fats={nutritionResult.totalFats}
              carbs={nutritionResult.totalCarbs}
            />
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FF6B6B",
  },
  title: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B6B",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
  },
  calculateButton: {
    marginTop: 20,
  },
  resultContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
})

export default CalorieCalculatorScreen
