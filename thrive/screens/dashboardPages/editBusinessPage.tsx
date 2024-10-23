import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, TextInput, Button, Alert, FlatList } from "react-native";
import {
  Image,
  View,
} from "react-native-ui-lib";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { query, where, getDocs, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

const EditBusinessPage: React.FC = () => {
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");  // State for the image URL input
  const [uploading, setUploading] = useState(false);

  const route = useRoute();
  const { id } = route.params as { id: string };
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit Business Details", // Static title, no need to wait for data
      headerBackTitle: "Back",
    });
  }, [navigation]);
  

  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        const q = query(collection(FIRESTORE, "businessData"), where("businessID", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setBusinessData(doc.data());
        } else {
          console.log("No such document with the given businessID!");
          setBusinessData(null);
        }
      } catch (error) {
        console.error("Error fetching business data: ", error);
        setBusinessData(null);
      }
      setLoading(false);
    };

    fetchBusinessData();
  }, [id]);

  const handleSave = async () => {
    try {
      const q = query(collection(FIRESTORE, "businessData"), where("businessID", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, businessData);
        Alert.alert("Success", "Business information updated successfully!");
      } else {
        Alert.alert("Error", "No business found with the given ID.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update business information.");
      console.error("Error updating business data: ", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setBusinessData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUrlUpload = async () => {
    if (!imageUrl.trim()) {
      Alert.alert("Error", "Please enter a valid image URL.");
      return;
    }
    
    if (businessData.images.includes(imageUrl.trim())) {
      Alert.alert("Error", "This image URL is already added.");
      return;
    }
  
    handleInputChange("images", [...(businessData.images || []), imageUrl.trim()]);
    setImageUrl(""); // Clear the input field after adding the URL
    Alert.alert("Success", "Image URL added!");
  };
  
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...businessData.images];
    updatedImages.splice(index, 1);  // Remove the selected image
    handleInputChange("images", updatedImages);  // Update the business data with new images
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.pageContainer}>
        <Text style={{ textAlign: "center", fontSize: 30, paddingVertical: 20 }}>Edit Business Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            value={businessData?.businessName || ""}
            onChangeText={(text) => handleInputChange("businessName", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}  // Apply the larger input style here
            value={businessData?.description || ""}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={businessData?.phoneNumber || ""}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={businessData?.location || ""}
            onChangeText={(text) => handleInputChange("location", text)}
          />
        </View>

        {/* Image picker and upload section */}

        {/* Display current images */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Images</Text>
          {businessData?.images?.length > 0 ? (
            <FlatList
            data={businessData.images}
            keyExtractor={(item, index) => `image-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.imageItem}>
                <Image source={{ uri: item }} style={styles.image} />
                <Button title="Remove" onPress={() => handleRemoveImage(index)} />
              </View>
            )}
            horizontal
          />
          
          
          ) : (
            <Text>No images available</Text>
          )}
        </View>

        {/* Add image by URL */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Add Image by URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Enter image URL"
          />
          <Button title="Add Image" onPress={handleUrlUpload} />
        </View>

        {/* Other business fields */}

        <View style={styles.buttonContainer}>
          <Button title="Save Changes" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  pageContainer: {
    padding: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderColor: "#CCC",
    borderWidth: 1,
    fontSize: 16,
  },
  descriptionInput: {
    height: 120, // Increase the height for a larger text box
    textAlignVertical: "top", // Ensure text starts at the top of the input
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  imageItem: {
    marginRight: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default EditBusinessPage;
