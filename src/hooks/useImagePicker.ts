import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Custom hook to handle image selection using expo-image-picker.
 * Encapsulates permissions and common logic for picking images.
 */
export const useImagePicker = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const pickImage = async () => {
        try {
            // Request permissions if not already granted
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'We need camera roll permissions to let you upload images.'
                );
                return;
            }

            // Launch the image library
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], // Square aspect ratio typically used for logos/profiles
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Something went wrong while picking the image.');
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    return {
        selectedImage,
        pickImage,
        removeImage,
        setSelectedImage // For setting initial values if needed
    };
};
