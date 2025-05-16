import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface NutritionInfoProps {
  calories: number
  proteins: number
  fats: number
  carbs: number
}

const NutritionInfo: React.FC<NutritionInfoProps> = ({ calories, proteins, fats, carbs }) => {
  return (
    <View style={styles.container}>
      <View style={styles.caloriesContainer}>
        <Text style={styles.caloriesValue}>{Math.round(calories)}</Text>
        <Text style={styles.caloriesLabel}>kcal</Text>
      </View>

      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, { backgroundColor: "#4CAF50" }]} />
          <View style={styles.macroContent}>
            <Text style={styles.macroValue}>{proteins.toFixed(1)}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
        </View>

        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, { backgroundColor: "#FF9800" }]} />
          <View style={styles.macroContent}>
            <Text style={styles.macroValue}>{fats.toFixed(1)}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>

        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, { backgroundColor: "#2196F3" }]} />
          <View style={styles.macroContent}>
            <Text style={styles.macroValue}>{carbs.toFixed(1)}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
  },
  caloriesContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  caloriesLabel: {
    fontSize: 14,
    color: "#666",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  macroContent: {
    flexDirection: "column",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  macroLabel: {
    fontSize: 12,
    color: "#666",
  },
})

export default NutritionInfo
