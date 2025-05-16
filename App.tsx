import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { AuthProvider } from "./src/contexts/AuthContext"
import { NavigationContainer } from "@react-navigation/native"
import RootNavigator from "./src/navigation/RootNavigator"
import { ToastProvider } from "./src/contexts/ToastContext"
import { ClerkProvider } from "@clerk/clerk-expo"
import * as SecureStore from "expo-secure-store"

const CLERK_PUBLISHABLE_KEY = "pk_test_ZGVsaWNhdGUtY2FtZWwtNTIuY2xlcmsuYWNjb3VudHMuZGV2JA"
const tokenCache = {
  async getToken(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
};

export default function App() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <RootNavigator />
            </NavigationContainer>
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  )
}
