"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { type RouteProp, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { ShoppingListsStackParamList } from "../../navigation/ShoppingListsNavigator"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { ShoppingListDto, ShoppingListItemDto, ShoppingListItemUpdateDto } from "../../types/shoppingList"

type ShoppingListDetailScreenRouteProp = RouteProp<ShoppingListsStackParamList, "ShoppingListDetail">

const ShoppingListDetailScreen = () => {
  const route = useRoute<ShoppingListDetailScreenRouteProp>()
  const { showToast } = useToast()
  const { shoppingListId } = route.params
  const [shoppingList, setShoppingList] = useState<ShoppingListDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchShoppingList = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/api/ShoppingLists/${shoppingListId}`)
      setShoppingList(response.data)
    } catch (error) {
      console.error("Error fetching shopping list:", error)
      showToast("Failed to load shopping list", "error")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchShoppingList()
  }, [shoppingListId])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchShoppingList()
  }

  const toggleItemChecked = async (item: ShoppingListItemDto) => {
    try {
      const updateData: ShoppingListItemUpdateDto = {
        id: item.id,
        isChecked: !item.isChecked,
      }

      await api.patch(`/api/ShoppingLists/item/${item.id}`, updateData)

      // Update local state
      if (shoppingList) {
        const updatedItems = shoppingList.items.map((i) => (i.id === item.id ? { ...i, isChecked: !i.isChecked } : i))

        setShoppingList({
          ...shoppingList,
          items: updatedItems,
        })
      }
    } catch (error) {
      console.error("Error updating item:", error)
      showToast("Failed to update item", "error")
    }
  }

  const renderShoppingListItem = ({ item }: { item: ShoppingListItemDto }) => (
    <TouchableOpacity
      style={[styles.listItem, item.isChecked && styles.listItemChecked]}
      onPress={() => toggleItemChecked(item)}
    >
      <View style={[styles.checkbox, item.isChecked && styles.checkboxChecked]}>
        {item.isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>{item.productName}</Text>
        <Text style={styles.itemAmount}>
          {item.amount} {item.unit}
        </Text>
      </View>
    </TouchableOpacity>
  )

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  if (!shoppingList) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Shopping list not found</Text>
      </View>
    )
  }

  const completedCount = shoppingList.items.filter((item) => item.isChecked).length
  const totalCount = shoppingList.items.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{shoppingList.name}</Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {completedCount}/{totalCount} items completed
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <FlatList
        data={shoppingList.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderShoppingListItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in this shopping list</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
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
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  listContent: {
    padding: 16,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  listItemChecked: {
    backgroundColor: "#f9f9f9",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  itemNameChecked: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  itemAmount: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
})

export default ShoppingListDetailScreen
