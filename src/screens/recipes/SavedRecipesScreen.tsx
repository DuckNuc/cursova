"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RecipesStackParamList } from "../../navigation/RecipesNavigator"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { RecipeDto } from "../../types/recipe"
import RecipeCard from "../../components/recipes/RecipeCard"
import SearchBar from "../../components/common/SearchBar"

type SavedRecipesScreenNavigationProp = NativeStackNavigationProp<RecipesStackParamList, "SavedRecipes">

const SavedRecipesScreen = () => {
  const navigation = useNavigation<SavedRecipesScreenNavigationProp>()
  const { showToast } = useToast()
  const [recipes, setRecipes] = useState<RecipeDto[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeDto[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSavedRecipes = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/api/Recipes/saved")
      setRecipes(response.data)
      setFilteredRecipes(response.data)
    } catch (error) {
      console.error("Error fetching saved recipes:", error)
      showToast("Failed to load saved recipes", "error")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSavedRecipes()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(recipes)
    } else {
      const filtered = recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredRecipes(filtered)
    }
  }, [searchQuery, recipes])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchSavedRecipes()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar placeholder="Search saved recipes..." value={searchQuery} onChangeText={handleSearch} />
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={() => navigation.navigate("RecipeDetail", { recipeId: item.id })} />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't saved any recipes yet.</Text>
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
    textAlign: "center",
  },
})

export default SavedRecipesScreen
