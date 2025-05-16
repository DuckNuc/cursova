"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AuthStackParamList } from "../../navigation/AuthNavigator"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>()
  const { signUp } = useAuth()
  const { showToast } = useToast()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error")
      return
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error")
      return
    }

    setIsLoading(true)
    try {
      await signUp(email, password, fullName)
    } catch (error) {
      showToast("Registration failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/recipe-logo.png")} style={styles.logo} />
          <Text style={styles.title}>Recipe Book</Text>
          <Text style={styles.subtitle}>Create a new account</Text>
        </View>

        <View style={styles.formContainer}>
          <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter your full name" />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />

          <Button title="Sign Up" onPress={handleRegister} isLoading={isLoading} />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  formContainer: {
    width: "100%",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
})

export default RegisterScreen
