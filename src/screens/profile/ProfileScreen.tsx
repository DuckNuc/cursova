"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"

const ProfileScreen = () => {
  const { user, updateProfile, signOut } = useAuth()
  const { showToast } = useToast()
  const [fullName, setFullName] = useState(user?.fullName || "")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      showToast("Please enter your full name", "error")
      return
    }

    setIsLoading(true)
    try {
      await updateProfile({ fullName })
      showToast("Profile updated successfully", "success")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast("Failed to update profile", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: async () => {
          try {
            await signOut()
          } catch (error) {
            console.error("Error signing out:", error)
            showToast("Failed to sign out", "error")
          }
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}</Text>
        </View>
        <Text style={styles.name}>{user?.fullName || "User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {!isEditing && (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={20} color="#FF6B6B" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter your full name" />

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={() => {
                  setFullName(user?.fullName || "")
                  setIsEditing(false)
                }}
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
                variant="outline"
              />
              <Button title="Save" onPress={handleUpdateProfile} isLoading={isLoading} style={styles.saveButton} />
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name:</Text>
              <Text style={styles.infoValue}>{user?.fullName || "Not set"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role:</Text>
              <Text style={styles.infoValue}>{user?.role}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#FF6B6B",
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButtonText: {
    marginLeft: 4,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  profileInfo: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  editForm: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  cancelButtonText: {
    color: "#FF6B6B",
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
  },
  signOutText: {
    marginLeft: 8,
    color: "#FF6B6B",
    fontWeight: "500",
    fontSize: 16,
  },
})

export default ProfileScreen
