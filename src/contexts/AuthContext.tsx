"use client"

import React, { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "../services/api"
import type { UserDto } from "../types/user"
import { useOAuth, useAuth as useClerkAuth } from "@clerk/clerk-expo"
import * as WebBrowser from "expo-web-browser";
import {  useSession } from "@clerk/clerk-expo";
WebBrowser.maybeCompleteAuthSession();
interface AuthContextData {
  user: UserDto | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (userData: Partial<UserDto>) => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
   const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { getToken } = useClerkAuth();
 
  useEffect(() => {
    loadStoredData()
  }, [])

  const loadStoredData = async () => {
    setIsLoading(true)
    try {
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem("@RecipeApp:user"),
        AsyncStorage.getItem("@RecipeApp:token"),
      ])

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`
      }
    } catch (error) {
      console.error("Error loading auth data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/Auth/login", { email, password })
      const { token: newToken, user: userData } = response.data

      await AsyncStorage.setItem("@RecipeApp:user", JSON.stringify(userData))
      await AsyncStorage.setItem("@RecipeApp:token", newToken)

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      setUser(userData)
      setToken(newToken)
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await api.post("/api/Auth/register", { email, password, fullName })
      const { token: newToken, user: userData } = response.data

      await AsyncStorage.setItem("@RecipeApp:user", JSON.stringify(userData))
      await AsyncStorage.setItem("@RecipeApp:token", newToken)

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      setUser(userData)
      setToken(newToken)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
  try {
    setIsLoading(true);
    const result = await startOAuthFlow();
    if (result?.createdSessionId && typeof result?.setActive === "function") {
      await result.setActive({ session: result.createdSessionId });
      const clerkToken = await getToken({ template: "custom_token" });
      console.log("Кастомний токен:", clerkToken);

      if (!clerkToken) {
        alert("Не вдалося отримати токен!");
        setIsLoading(false);
        return;
      }

      // Відправляємо токен на бекенд
      const response = await api.post("/api/Auth/google-login", { clerkToken });
      console.log("Відповідь бекенду:", response.data);

      const { token: jwt, user: userData } = response.data;

      await AsyncStorage.setItem("@RecipeApp:user", JSON.stringify(userData));
      await AsyncStorage.setItem("@RecipeApp:token", jwt);

      const storedUser = await AsyncStorage.getItem("@RecipeApp:user");
const storedToken = await AsyncStorage.getItem("@RecipeApp:token");
console.log("Перевірка збереження в AsyncStorage:", storedUser, storedToken);

      setUser(userData);
      setToken(jwt);

      // Тут додай лог для перевірки!
      console.log("User та токен збережено. JWT:", jwt);

      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    }
  } catch (error) {
    console.error("Помилка входу через Google:", error);
    alert("Помилка входу через Google!");
  } finally {
    setIsLoading(false);
  }
};





  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("@RecipeApp:user")
      await AsyncStorage.removeItem("@RecipeApp:token")

      setUser(null)
      setToken(null)
      delete api.defaults.headers.common["Authorization"]
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const updateProfile = async (userData: Partial<UserDto>) => {
    try {
      const response = await api.put("/api/Users/profile", userData)
      const updatedUser = response.data

      await AsyncStorage.setItem("@RecipeApp:user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
