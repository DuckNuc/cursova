"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
  SafeAreaView,
} from "react-native"
import { type RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { WebView } from "react-native-webview";
import type { RecipesStackParamList } from "../../navigation/RecipesNavigator"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { RecipeDto } from "../../types/recipe"
import NutritionInfo from "../../components/recipes/NutritionInfo"
import IngredientsList from "../../components/recipes/IngredientsList"

type RecipeDetailScreenRouteProp = RouteProp<RecipesStackParamList, "RecipeDetail">
type RecipeDetailScreenNavigationProp = NativeStackNavigationProp<RecipesStackParamList, "RecipeDetail">

const RecipeDetailScreen = () => {
  const route = useRoute<RecipeDetailScreenRouteProp>()
  const navigation = useNavigation<RecipeDetailScreenNavigationProp>()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { recipeId } = route.params
  const [recipe, setRecipe] = useState<RecipeDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")

  const API_URL = "https://moth-bright-frankly.ngrok-free.app"

  function getFullImageUrl(imageUrl) {
    if (!imageUrl) return null
    return imageUrl.startsWith("https") ? imageUrl : `${API_URL}${imageUrl}`
  }

  const fetchRecipe = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/api/Recipes/${recipeId}`)
      setRecipe(response.data)
    } catch (error) {
      console.error("Error fetching recipe:", error)
      showToast("Failed to load recipe details", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipe()
  }, [recipeId])

  const handleSaveRecipe = async () => {
    if (!recipe) return

    setIsSaving(true)
    try {
      if (recipe.isSaved) {
        await api.delete(`/api/Recipes/${recipe.id}/unsave`)
        showToast("Recipe removed from saved", "info")
      } else {
        await api.post(`/api/Recipes/${recipe.id}/save`)
        showToast("Recipe saved successfully", "success")
      }

      // Update the recipe state
      setRecipe({
        ...recipe,
        isSaved: !recipe.isSaved,
      })
    } catch (error) {
      console.error("Error saving/unsaving recipe:", error)
      showToast("Failed to save/unsave recipe", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditRecipe = () => {
    if (recipe) {
      navigation.navigate("EditRecipe", { recipeId: recipe.id })
    }
  }

  const handleDeleteRecipe = () => {
    Alert.alert("Delete Recipe", "Are you sure you want to delete this recipe?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/Recipes/${recipeId}`)
            showToast("Recipe deleted successfully", "success")
            navigation.goBack()
          } catch (error) {
            console.error("Error deleting recipe:", error)
            showToast("Failed to delete recipe", "error")
          }
        },
      },
    ])
  }

  const getYoutubeVideoId = (url) => {
    if (!url) return null

    // Регулярні вирази для різних форматів YouTube URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[2].length === 11 ? match[2] : null
  }

  const getEmbedUrl = (url) => {
    const videoId = getYoutubeVideoId(url)
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }

    // Якщо це не YouTube URL, повертаємо оригінальний URL
    return url
  }

  const handleWatchVideo = () => {
    if (!recipe?.videoUrl) return

    try {
      // Перевіряємо, чи URL валідний
      const isValidUrl = recipe.videoUrl.startsWith("http://") || recipe.videoUrl.startsWith("https://")

      if (!isValidUrl) {
        showToast("Невалідне посилання на відео", "error")
        return
      }

      // Отримуємо URL для вбудовування
      const embedUrl = getEmbedUrl(recipe.videoUrl)
      setVideoUrl(embedUrl)
      setVideoModalVisible(true)
    } catch (error) {
      console.error("Error preparing video:", error)
      showToast("Помилка при підготовці відео", "error")
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    )
  }

  const isOwner = user?.id === recipe.userId
  const isAdmin = user?.role === "Admin"

  return (
    <>
      <ScrollView style={styles.container}>
        {recipe.imageUrl ? (
          <Image source={{ uri: getFullImageUrl(recipe.imageUrl) }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="restaurant-outline" size={60} color="#ccc" />
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{recipe.userFullName}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="folder-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{recipe.categoryName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {user && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSaveRecipe} disabled={isSaving}>
              <Ionicons name={recipe.isSaved ? "bookmark" : "bookmark-outline"} size={20} color="#FF6B6B" />
              <Text style={styles.actionText}>{recipe.isSaved ? "Saved" : "Save"}</Text>
            </TouchableOpacity>
          )}

          {(isOwner || isAdmin) && (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={handleEditRecipe}>
                <Ionicons name="create-outline" size={20} color="#FF6B6B" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleDeleteRecipe}>
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Information</Text>
          <NutritionInfo
            calories={recipe.totalCalories}
            proteins={recipe.totalProteins}
            fats={recipe.totalFats}
            carbs={recipe.totalCarbs}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <IngredientsList ingredients={recipe.ingredients} />
        </View>

        {recipe.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>
        )}

        {recipe.videoUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video</Text>
            <TouchableOpacity style={styles.videoLink} onPress={handleWatchVideo}>
              <Ionicons name="videocam-outline" size={20} color="#FF6B6B" />
              <Text style={styles.videoLinkText}>Watch Video</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={videoModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <SafeAreaView style={styles.videoModalContainer}>
          <View style={styles.videoModalHeader}>
            <TouchableOpacity onPress={() => setVideoModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.videoModalTitle}>{recipe?.title}</Text>
          </View>

          <View style={styles.videoContainer}>
            {videoUrl && (
              <WebView
                source={{ uri: videoUrl }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={["*"]}
                useWebKit={true}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  )
}

const { width } = Dimensions.get("window")
const videoHeight = width * 0.5625 // 16:9 aspect ratio

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
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
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
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    padding: 8,
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 4,
    color: "#FF6B6B",
    fontWeight: "500",
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  videoLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  videoLinkText: {
    marginLeft: 8,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  videoModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  videoModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  videoContainer: {
    width: "100%",
    height: videoHeight,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
})

export default RecipeDetailScreen
