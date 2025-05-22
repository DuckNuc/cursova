"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native"
import { type RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import type { RecipesStackParamList } from "../../navigation/RecipesNavigator"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { CategoryDto } from "../../types/category"
import type { ProductDto } from "../../types/product"
import type { RecipeDto, RecipeProductCreateDto } from "../../types/recipe"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"
import CategoryPicker from "../../components/common/CategoryPicker"
import IngredientInput from "../../components/recipes/IngredientInput"
import * as ImagePicker from "expo-image-picker"
import mime from "mime"

type EditRecipeScreenRouteProp = RouteProp<RecipesStackParamList, "EditRecipe">
type EditRecipeScreenNavigationProp = NativeStackNavigationProp<RecipesStackParamList, "EditRecipe">

const EditRecipeScreen = () => {
  const route = useRoute<EditRecipeScreenRouteProp>()
  const navigation = useNavigation<EditRecipeScreenNavigationProp>()
  const { showToast } = useToast()
  const { recipeId } = route.params

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [ingredients, setIngredients] = useState<RecipeProductCreateDto[]>([])
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [products, setProducts] = useState<ProductDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [cookingTime, setCookingTime] = useState("30") // Час приготування в хвилинах
  const [servings, setServings] = useState("2") // Кількість порцій

  const CLOUD_NAME = "dxhj6beyi"
  const UPLOAD_PRESET = "recipe_app"

  const uploadToCloudinary = async (localUri) => {
    const fileName = localUri.split("/").pop()
    const mimeType = mime.getType(localUri) || "image/jpeg"
    const formData = new FormData()
    formData.append("file", {
      uri: localUri,
      type: mimeType,
      name: fileName,
    } as any)
    formData.append("upload_preset", UPLOAD_PRESET)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Upload failed")

    const data = await response.json()
    return data.secure_url
  }

  useEffect(() => {
    Promise.all([fetchRecipe(), fetchCategories(), fetchProducts()])
      .then(() => {
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error initializing edit screen:", error)
        showToast("Failed to load data", "error")
        setIsLoading(false)
      })
  }, [recipeId])

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/api/Recipes/${recipeId}`)
      const recipe: RecipeDto = response.data

      setTitle(recipe.title)
      setDescription(recipe.description || "")
      setImageUrl(recipe.imageUrl || "")
      setVideoUrl(recipe.videoUrl || "")
      setCategoryId(recipe.categoryId)
      setCookingTime(recipe.cookingTime?.toString() || "30")
      setServings(recipe.servings?.toString() || "2")

      // Convert recipe ingredients to the format needed for editing
      const recipeIngredients = recipe.ingredients.map((ingredient) => ({
        productId: ingredient.productId,
        amountGrams: ingredient.amountGrams,
      }))

      setIngredients(recipeIngredients)
    } catch (error) {
      console.error("Error fetching recipe:", error)
      throw error
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/Categories/recipes")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/Products")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  }

  const handleAddIngredient = () => {
    if (products.length === 0) {
      showToast("No products available", "error")
      return
    }

    setIngredients([...ingredients, { productId: products[0].id, amountGrams: 100 }])
  }

  const handleUpdateIngredient = (index: number, ingredient: RecipeProductCreateDto) => {
    const updatedIngredients = [...ingredients]
    updatedIngredients[index] = ingredient
    setIngredients(updatedIngredients)
  }

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...ingredients]
    updatedIngredients.splice(index, 1)
    setIngredients(updatedIngredients)
  }

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      showToast("Дозвіл на доступ до галереї не надано", "error")
      return
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    })

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const selectedAsset = pickerResult.assets[0]
      setSelectedImage(selectedAsset)
      setImageUrl(selectedAsset.uri || "")
    }
  }

  const handleSubmit = async () => {
    if (!title) {
      showToast("Please enter a title", "error")
      return
    }

    if (!categoryId) {
      showToast("Please select a category", "error")
      return
    }

    if (ingredients.length === 0) {
      showToast("Please add at least one ingredient", "error")
      return
    }

    setIsSaving(true)
    try {
      // Upload image if selected
      let finalImageUrl = imageUrl
      if (selectedImage && selectedImage.uri && !selectedImage.uri.startsWith("http")) {
        // якщо юзер вибрав нове фото — вантаж у Cloudinary
        finalImageUrl = await uploadToCloudinary(selectedImage.uri)
      }

      const recipeData = {
        title,
        description,
        imageUrl: finalImageUrl,
        videoUrl,
        categoryId,
        ingredients,
        cookingTime: Number.parseInt(cookingTime) || 30,
        servings: Number.parseInt(servings) || 2,
      }

      await api.put(`/api/Recipes/${recipeId}`, recipeData)
      showToast("Recipe updated successfully", "success")
      navigation.goBack()
    } catch (error) {
      console.error("Error updating recipe:", error)
      showToast("Failed to update recipe", "error")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Input label="Title" value={title} onChangeText={setTitle} placeholder="Recipe title" required />

          <View style={styles.recipeMetaContainer}>
            <View style={styles.recipeMetaItem}>
              <Input
                label="Cooking Time (min)"
                value={cookingTime}
                onChangeText={setCookingTime}
                placeholder="30"
                keyboardType="numeric"
                style={styles.metaInput}
              />
            </View>
            <View style={styles.recipeMetaItem}>
              <Input
                label="Servings"
                value={servings}
                onChangeText={setServings}
                placeholder="2"
                keyboardType="numeric"
                style={styles.metaInput}
              />
            </View>
          </View>

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Recipe description and cooking instructions"
            multiline
            numberOfLines={6}
          />

          <View style={styles.imagePickerContainer}>
            <Text style={styles.label}>Recipe Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handleSelectImage}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="image-outline" size={40} color="#ccc" />
                  <Text style={styles.placeholderText}>Tap to select an image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Input label="Video URL" value={videoUrl} onChangeText={setVideoUrl} placeholder="URL to recipe video" />

          <CategoryPicker
            label="Category"
            categories={categories}
            selectedCategory={categoryId}
            onSelectCategory={setCategoryId}
            required
          />

          <View style={styles.ingredientsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {ingredients.length === 0 ? (
              <Text style={styles.noIngredientsText}>No ingredients added. Tap the + button to add ingredients.</Text>
            ) : (
              ingredients.map((ingredient, index) => (
                <IngredientInput
                  key={index}
                  ingredient={ingredient}
                  products={products}
                  onChange={(updatedIngredient) => handleUpdateIngredient(index, updatedIngredient)}
                  onRemove={() => handleRemoveIngredient(index)}
                />
              ))
            )}
          </View>

          <Button title="Update Recipe" onPress={handleSubmit} isLoading={isSaving} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formContainer: {
    padding: 16,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recipeMetaItem: {
    width: "48%",
  },
  metaInput: {
    marginBottom: 0,
  },
  ingredientsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  noIngredientsText: {
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
  },
  imagePickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  imagePicker: {
    height: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: "#666",
  },
})

export default EditRecipeScreen
