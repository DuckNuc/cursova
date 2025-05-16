import { createNativeStackNavigator } from "@react-navigation/native-stack"
import RecipesScreen from "../screens/recipes/RecipesScreen"
import RecipeDetailScreen from "../screens/recipes/RecipeDetailScreen"
import CreateRecipeScreen from "../screens/recipes/CreateRecipeScreen"
import EditRecipeScreen from "../screens/recipes/EditRecipeScreen"
import MyRecipesScreen from "../screens/recipes/MyRecipesScreen"
import SavedRecipesScreen from "../screens/recipes/SavedRecipesScreen"

export type RecipesStackParamList = {
  Recipes: undefined
  RecipeDetail: { recipeId: number }
  CreateRecipe: undefined
  EditRecipe: { recipeId: number }
  MyRecipes: undefined
  SavedRecipes: undefined
}

const Stack = createNativeStackNavigator<RecipesStackParamList>()

const RecipesNavigator = () => {
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
      <Stack.Screen name="Recipes" component={RecipesScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: "Recipe Details" }} />
      <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} options={{ title: "Create Recipe" }} />
      <Stack.Screen name="EditRecipe" component={EditRecipeScreen} options={{ title: "Edit Recipe" }} />
      <Stack.Screen name="MyRecipes" component={MyRecipesScreen} options={{ title: "My Recipes" }} />
      <Stack.Screen name="SavedRecipes" component={SavedRecipesScreen} options={{ title: "Saved Recipes" }} />
    </Stack.Navigator>
  )
}

export default RecipesNavigator
