"use client"

import { useState, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import type { ShoppingListsStackParamList } from "../../navigation/ShoppingListsNavigator"
import { useToast } from "../../contexts/ToastContext"
import { api } from "../../services/api"
import type { ShoppingListDto } from "../../types/shoppingList"

type ShoppingListsScreenNavigationProp = NativeStackNavigationProp<ShoppingListsStackParamList, "ShoppingLists">

const ShoppingListsScreen = () => {
  const navigation = useNavigation<ShoppingListsScreenNavigationProp>()
  const { showToast } = useToast()
  const [shoppingLists, setShoppingLists] = useState<ShoppingListDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchShoppingLists = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/api/ShoppingLists")
      setShoppingLists(response.data)
    } catch (error) {
      console.error("Error fetching shopping lists:", error)
      showToast("Failed to load shopping lists", "error")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchShoppingLists()
    }, []),
  )

  const handleRefresh = () => {
    setRefreshing(true)
    fetchShoppingLists()
  }

  const handleDeleteShoppingList = async (id: number) => {
    try {
      await api.delete(`/api/ShoppingLists/${id}`)
      setShoppingLists(shoppingLists.filter((list) => list.id !== id))
      showToast("Shopping list deleted", "success")
    } catch (error) {
      console.error("Error deleting shopping list:", error)
      showToast("Failed to delete shopping list", "error")
    }
  }

  const renderShoppingListItem = ({ item }: { item: ShoppingListDto }) => {
    const itemCount = item.items.length
    const checkedCount = item.items.filter((i) => i.isChecked).length

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => navigation.navigate("ShoppingListDetail", { shoppingListId: item.id })}
      >
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{item.name}</Text>
          <Text style={styles.listItemMeta}>
            {itemCount} items • {checkedCount}/{itemCount} completed
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${itemCount > 0 ? (checkedCount / itemCount) * 100 : 0}%` }]}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteShoppingList(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderShoppingListItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={60} color="#ddd" />
            <Text style={styles.emptyText}>No shopping lists yet</Text>
            <Text style={styles.emptySubtext}>Create a new shopping list or add ingredients from a recipe</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("CreateShoppingList")}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  listItemMeta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#eee",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
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
})

export default ShoppingListsScreen
