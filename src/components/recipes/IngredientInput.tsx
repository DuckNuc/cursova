"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ProductDto } from "../../types/product"
import type { RecipeProductCreateDto } from "../../types/recipe"
import Input from "../common/Input"

interface IngredientInputProps {
  ingredient: RecipeProductCreateDto
  products: ProductDto[]
  onChange: (ingredient: RecipeProductCreateDto) => void
  onRemove: () => void
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredient, products, onChange, onRemove }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const selectedProduct = products.find((p) => p.id === ingredient.productId)

  const handleAmountChange = (text: string) => {
    const amount = Number.parseFloat(text) || 0
    onChange({ ...ingredient, amountGrams: amount })
  }

  const handleProductSelect = (productId: number) => {
    onChange({ ...ingredient, productId })
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.productName}>{selectedProduct ? selectedProduct.name : "Select product"}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.productSelector} onPress={() => setModalVisible(true)}>
          <Ionicons name="nutrition-outline" size={20} color="#666" />
          <Text style={styles.selectorText}>{selectedProduct ? selectedProduct.name : "Select product"}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <View style={styles.amountContainer}>
          <Input
            label="Amount (g)"
            value={ingredient.amountGrams.toString()}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            style={styles.amountInput}
          />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.productItem, ingredient.productId === item.id && styles.selectedProductItem]}
                  onPress={() => handleProductSelect(item.id)}
                >
                  <View>
                    <Text style={styles.productItemName}>{item.name}</Text>
                    <Text style={styles.productItemCategory}>{item.categoryName}</Text>
                  </View>
                  <Text style={styles.productItemCalories}>{Math.round(item.caloriesPer100g)} kcal/100g</Text>
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
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  removeButton: {
    padding: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  productSelector: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  selectorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  amountContainer: {
    flex: 1,
  },
  amountInput: {
    marginBottom: 0,
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
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedProductItem: {
    backgroundColor: "#FFF0F0",
  },
  productItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  productItemCategory: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  productItemCalories: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
  },
})

export default IngredientInput
