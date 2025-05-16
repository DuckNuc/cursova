import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { RecipeDto } from "../../types/recipe"

interface RecipeCardProps {
  recipe: RecipeDto
  onPress: () => void
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {recipe.imageUrl ? (
          <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="restaurant-outline" size={40} color="#ccc" />
          </View>
        )}
        {recipe.isSaved && (
          <View style={styles.savedBadge}>
            <Ionicons name="bookmark" size={16} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color="#666" />
            <Text style={styles.metaText} numberOfLines={1}>
              {recipe.userFullName}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="folder-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{recipe.categoryName}</Text>
          </View>
        </View>

        <View style={styles.nutritionContainer}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(recipe.totalCalories)}</Text>
            <Text style={styles.nutritionLabel}>kcal</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{recipe.totalProteins.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>protein</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{recipe.totalFats.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>fat</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{recipe.totalCarbs.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>carbs</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  savedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  nutritionLabel: {
    fontSize: 10,
    color: "#666",
  },
})

export default RecipeCard
