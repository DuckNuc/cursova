import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProductsScreen from "../screens/products/ProductsScreen"
import ProductDetailScreen from "../screens/products/ProductDetailScreen"

export type ProductsStackParamList = {
  Products: undefined
  ProductDetail: { productId: number }
}

const Stack = createNativeStackNavigator<ProductsStackParamList>()

const ProductsNavigator = () => {
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
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Product Details" }} />
    </Stack.Navigator>
  )
}

export default ProductsNavigator
