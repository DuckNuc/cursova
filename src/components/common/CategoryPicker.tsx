"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { CategoryDto } from "../../types/category"

interface CategoryPickerProps {
  label?: string
  categories: CategoryDto[]
  selectedCategory: number | null
  onSelectCategory: (categoryId: number | null) => void
  required?: boolean
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  label,
  categories,
  selectedCategory,
  onSelectCategory,
  required,
}) => {
  const [modalVisible, setModalVisible] = useState(false)

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : "Select a category"

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={[styles.pickerText, !selectedCategory && styles.placeholderText]}>{selectedCategoryName}</Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryItem, selectedCategory === item.id && styles.selectedCategoryItem]}
                  onPress={() => {
                    onSelectCategory(item.id)
                    setModalVisible(false)
                  }}
                >
                  <Text style={[styles.categoryText, selectedCategory === item.id && styles.selectedCategoryText]}>
                    {item.name}
                  </Text>
                  {selectedCategory === item.id && <Ionicons name="checkmark" size={20} color="#FF6B6B" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  required: {
    color: "#FF6B6B",
    marginLeft: 4,
  },
  pickerButton: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedCategoryItem: {
    backgroundColor: "#FFF0F0",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
})

export default CategoryPicker
