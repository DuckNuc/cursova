"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { Text, StyleSheet, Animated } from "react-native"

interface ToastContextData {
  showToast: (message: string, type?: "success" | "error" | "info") => void
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState<"success" | "error" | "info">("info")
  const fadeAnim = useState(new Animated.Value(0))[0]

  const showToast = (msg: string, toastType: "success" | "error" | "info" = "info") => {
    setMessage(msg)
    setType(toastType)
    setVisible(true)

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false)
    })
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50"
      case "error":
        return "#F44336"
      case "info":
      default:
        return "#2196F3"
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View style={[styles.container, { backgroundColor: getBackgroundColor(), opacity: fadeAnim }]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
})

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
