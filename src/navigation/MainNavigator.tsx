import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import RecipesNavigator from "./RecipesNavigator"
import ProductsNavigator from "./ProductsNavigator"
import CalorieCalculatorScreen from "../screens/calculator/CalorieCalculatorScreen"
import ProfileScreen from "../screens/profile/ProfileScreen"
import ShoppingListsNavigator from "./ShoppingListsNavigator"

const Tab = createBottomTabNavigator()

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home"

          if (route.name === "RecipesTab") {
            iconName = focused ? "restaurant" : "restaurant-outline"
          } else if (route.name === "ProductsTab") {
            iconName = focused ? "nutrition" : "nutrition-outline"
          } else if (route.name === "CalculatorTab") {
            iconName = focused ? "calculator" : "calculator-outline"
          } else if (route.name === "ShoppingListsTab") {
            iconName = focused ? "cart" : "cart-outline"
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="RecipesTab" component={RecipesNavigator} options={{ title: "Recipes" }} />
      <Tab.Screen name="ProductsTab" component={ProductsNavigator} options={{ title: "Products" }} />
      <Tab.Screen name="CalculatorTab" component={CalorieCalculatorScreen} options={{ title: "Calculator" }} />
      <Tab.Screen name="ShoppingListsTab" component={ShoppingListsNavigator} options={{ title: "Shopping" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  )
}

export default MainNavigator
