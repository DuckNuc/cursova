"use client"

import { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Text } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import type { RecipesStackParamList } from "../../navigation/RecipesNavigator"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { RecipeDto } from "../../types/recipe"
import type { CategoryDto } from "../../types/category"
import RecipeCard from "../../components/recipes/RecipeCard"
import SearchBar from "../../components/common/SearchBar"
import CategoryFilter from "../../components/common/CategoryFilter"

type RecipesScreenNavigationProp = NativeStackNavigationProp<RecipesStackParamList, "Recipes">

const RecipesScreen = () => {
  const navigation = useNavigation<RecipesScreenNavigationProp>()
  const { showToast } = useToast()
  const [recipes, setRecipes] = useState<RecipeDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/Categories/recipes")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      showToast("Failed to load categories", "error")
    }
  }

  const fetchRecipes = async (categoryId?: number, query?: string) => {
    setIsLoading(true)
    try {
      let url = "/api/Recipes"

      if (categoryId) {
        url = `/api/Recipes/category/${categoryId}`
      } else if (query) {
        url = `/api/Recipes/search?query=${query}`
      }

      const response = await api.get(url)
      setRecipes(response.data)
    } catch (error) {
      console.error("Error fetching recipes:", error)
      showToast("Failed to load recipes", "error")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCategories()
      fetchRecipes(selectedCategory, searchQuery)
    }, []),
  )

  useEffect(() => {
    fetchRecipes(selectedCategory, searchQuery)
  }, [selectedCategory, searchQuery])

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchRecipes(selectedCategory, searchQuery)
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <SearchBar placeholder="Search recipes..." value={searchQuery} onChangeText={handleSearch} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("MyRecipes")}>
          <Ionicons name="person" size={18} color="#FF6B6B" />
          <Text style={styles.actionButtonText}>My Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("SavedRecipes")}>
          <Ionicons name="bookmark" size={18} color="#FF6B6B" />
          <Text style={styles.actionButtonText}>Saved</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {renderHeader()}

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={() => navigation.navigate("RecipeDetail", { recipeId: item.id })} />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recipes found</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("CreateRecipe")}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    padding: 8,
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    color: "#FF6B6B",
    fontWeight: "500",
  },
})

export default RecipesScreen
