import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type TouchableOpacityProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native"

interface ButtonProps extends TouchableOpacityProps {
  title: string
  isLoading?: boolean
  variant?: "primary" | "outline" | "secondary"
  textStyle?: StyleProp<TextStyle>
  style?: StyleProp<ViewStyle>
}

const Button: React.FC<ButtonProps> = ({
  title,
  isLoading,
  variant = "primary",
  textStyle,
  style,
  disabled,
  ...rest
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "outline":
        return styles.buttonOutline
      case "secondary":
        return styles.buttonSecondary
      case "primary":
      default:
        return styles.buttonPrimary
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.textOutline
      case "secondary":
        return styles.textSecondary
      case "primary":
      default:
        return styles.textPrimary
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), (disabled || isLoading) && styles.buttonDisabled, style]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#fff" : "#FF6B6B"} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: "#FF6B6B",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonSecondary: {
    backgroundColor: "#f0f0f0",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  textPrimary: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  textOutline: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  textSecondary: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default Button
