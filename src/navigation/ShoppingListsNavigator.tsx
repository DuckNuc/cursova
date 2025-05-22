import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ShoppingListsScreen from "../screens/shopping/ShoppingListsScreen"
import ShoppingListDetailScreen from "../screens/shopping/ShoppingListDetailScreen"
import CreateShoppingListScreen from "../screens/shopping/CreateShoppingListScreen"

export type ShoppingListsStackParamList = {
  ShoppingLists: undefined
  ShoppingListDetail: { shoppingListId: number }
  CreateShoppingList: undefined
}

const Stack = createNativeStackNavigator<ShoppingListsStackParamList>()

const ShoppingListsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FF6B6B",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="ShoppingLists" component={ShoppingListsScreen} options={{ title: "Shopping Lists" }} />
      <Stack.Screen
        name="ShoppingListDetail"
        component={ShoppingListDetailScreen}
        options={{ title: "Shopping List" }}
      />
      <Stack.Screen
        name="CreateShoppingList"
        component={CreateShoppingListScreen}
        options={{ title: "Create Shopping List" }}
      />
    </Stack.Navigator>
  )
}

export default ShoppingListsNavigator
