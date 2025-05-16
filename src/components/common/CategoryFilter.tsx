import type React from "react"
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native"
import type { CategoryDto } from "../../types/category"

interface CategoryFilterProps {
  categories: CategoryDto[]
  selectedCategory: number | null
  onSelectCategory: (categoryId: number | null) => void
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[styles.categoryItem, selectedCategory === null && styles.selectedCategory]}
        onPress={() => onSelectCategory(null)}
      >
        <Text style={[styles.categoryText, selectedCategory === null && styles.selectedCategoryText]}>All</Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryItem, selectedCategory === category.id && styles.selectedCategory]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text style={[styles.categoryText, selectedCategory === category.id && styles.selectedCategoryText]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: "#FF6B6B",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "500",
  },
})

export default CategoryFilter
