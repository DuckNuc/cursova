"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { ProductsStackParamList } from "../../navigation/ProductsNavigator"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { ProductDto } from "../../types/product"
import type { CategoryDto } from "../../types/category"
import ProductCard from "../../components/products/ProductCard"
import SearchBar from "../../components/common/SearchBar"
import CategoryFilter from "../../components/common/CategoryFilter"

type ProductsScreenNavigationProp = NativeStackNavigationProp<ProductsStackParamList, "Products">

const ProductsScreen = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>()
  const { showToast } = useToast()
  const [products, setProducts] = useState<ProductDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/Categories/products")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      showToast("Failed to load categories", "error")
    }
  }

  const fetchProducts = async (categoryId?: number, query?: string) => {
    setIsLoading(true)
    try {
      let url = "/api/Products"

      if (categoryId) {
        url = `/api/Products/category/${categoryId}`
      } else if (query) {
        url = `/api/Products/search?query=${query}`
      }

      const response = await api.get(url)
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      showToast("Failed to load products", "error")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts(selectedCategory, searchQuery)
  }, [selectedCategory, searchQuery])

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchProducts(selectedCategory, searchQuery)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar placeholder="Search products..." value={searchQuery} onChangeText={handleSearch} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => navigation.navigate("ProductDetail", { productId: item.id })} />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listContent: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
})

export default ProductsScreen
