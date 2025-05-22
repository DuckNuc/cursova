"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import type { ShoppingListsStackParamList } from "../../navigation/ShoppingListsNavigator"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { ProductDto } from "../../types/product"
import type { ShoppingListCreateDto } from "../../types/shoppingList"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"

type CreateShoppingListScreenNavigationProp = NativeStackNavigationProp<
  ShoppingListsStackParamList,
  "CreateShoppingList"
>

interface ShoppingItem {
  productId: number
  productName: string
  amount: number
  unit: string
}

const CreateShoppingListScreen = () => {
  const navigation = useNavigation<CreateShoppingListScreenNavigationProp>()
  const { showToast } = useToast()
  const [name, setName] = useState("My Shopping List")
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [products, setProducts] = useState<ProductDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const response = await api.get("/api/Products")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      showToast("Failed to load products", "error")
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleAddItem = (product: ProductDto) => {
    // Check if product already exists in the list
    const existingItemIndex = items.findIndex((item) => item.productId === product.id)

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...items]
      updatedItems[existingItemIndex].amount += 100 // Increment by 100g
      setItems(updatedItems)
    } else {
      // Add new item
      setItems([
        ...items,
        {
          productId: product.id,
          productName: product.name,
          amount: 100,
          unit: "г",
        },
      ])
    }

    setShowProductSelector(false)
    setSearchQuery("")
  }

  const handleUpdateItemAmount = (index: number, amount: string) => {
    const numAmount = Number.parseInt(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    const updatedItems = [...items]
    updatedItems[index].amount = numAmount
    setItems(updatedItems)
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items]
    updatedItems.splice(index, 1)
    setItems(updatedItems)
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast("Please enter a name for the shopping list", "error")
      return
    }

    if (items.length === 0) {
      showToast("Please add at least one item to the shopping list", "error")
      return
    }

    setIsLoading(true)
    try {
      const shoppingListData: ShoppingListCreateDto = {
        name,
        items: items.map((item) => ({
          productId: item.productId,
          amount: item.amount,
          unit: item.unit,
        })),
      }

      await api.post("/api/ShoppingLists", shoppingListData)
      showToast("Shopping list created successfully", "success")
      navigation.goBack()
    } catch (error) {
      console.error("Error creating shopping list:", error)
      showToast("Failed to create shopping list", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts =
    searchQuery.trim() === ""
      ? products
      : products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Input
            label="Shopping List Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter shopping list name"
            required
          />

          <View style={styles.itemsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Items</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowProductSelector(true)}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {items.length === 0 ? (
              <Text style={styles.noItemsText}>No items added. Tap the + button to add items.</Text>
            ) : (
              items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <TouchableOpacity onPress={() => handleRemoveItem(index)} style={styles.removeButton}>
                      <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Amount:</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={item.amount.toString()}
                      onChangeText={(text) => handleUpdateItemAmount(index, text)}
                      keyboardType="numeric"
                    />
                    <Text style={styles.unitText}>{item.unit}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <Button
            title="Create Shopping List"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Product</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowProductSelector(false)
                  setSearchQuery("")
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {isLoadingProducts ? (
              <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
            ) : (
              <ScrollView style={styles.productList}>
                {filteredProducts.length === 0 ? (
                  <Text style={styles.noProductsText}>No products found</Text>
                ) : (
                  filteredProducts.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productItem}
                      onPress={() => handleAddItem(product)}
                    >
                      <View>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productCategory}>{product.categoryName}</Text>
                      </View>
                      <Ionicons name="add-circle" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 16,
  },
  itemsSection: {
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
  noItemsText: {
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  removeButton: {
    padding: 4,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 6,
    width: 80,
    textAlign: "center",
  },
  unitText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  submitButton: {
    marginTop: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  loader: {
    padding: 20,
  },
  productList: {
    maxHeight: 400,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  productCategory: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  noProductsText: {
    padding: 20,
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
})

export default CreateShoppingListScreen
