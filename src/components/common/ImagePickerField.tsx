// components/ImagePickerField.tsx
import React, { useState } from "react"
import { View, Button, Image, Alert } from "react-native"
import { launchImageLibrary } from "react-native-image-picker"
import { api } from "../../services/api"

export default function ImagePickerField({
  onImageUploaded
}: {
  onImageUploaded: (url: string) => void
}) {
  const [previewUri, setPreviewUri] = useState<string | null>(null)

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.didCancel) return
      if (response.errorCode) {
        Alert.alert("Помилка", "Не вдалося вибрати фото")
        return
      }

      const image = response.assets?.[0]
      if (!image?.uri || !image?.fileName || !image?.type) return

      setPreviewUri(image.uri)

      const formData = new FormData()
      formData.append("photo", {
        uri: image.uri,
        name: image.fileName,
        type: image.type
      } as any)

      try {
        const res = await api.post("/api/Recipes/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        onImageUploaded(res.data.imageUrl)
      } catch (error) {
        console.error("Upload error:", error)
        Alert.alert("Помилка", "Не вдалося завантажити фото")
      }
    })
  }

  return (
    <View>
      <Button title="Обрати фото" onPress={handleSelectImage} />
      {previewUri && <Image source={{ uri: previewUri }} style={{ width: 200, height: 200, marginTop: 10 }} />}
    </View>
  )
}
