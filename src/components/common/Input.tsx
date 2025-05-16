import type React from "react"
import { View, Text, TextInput, StyleSheet, type TextInputProps } from "react-native"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  required?: boolean
}

const Input: React.FC<InputProps> = ({ label, error, required, style, ...rest }) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      <TextInput style={[styles.input, error && styles.inputError, style]} placeholderTextColor="#999" {...rest} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  required: {
    color: "#FF6B6B",
    marginLeft: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginTop: 4,
  },
})

export default Input
