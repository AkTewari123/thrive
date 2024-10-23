import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, TextInput, Button, Alert } from "react-native";
import {
  Carousel,
  Image,
  View,
  ProgressBar,
} from "react-native-ui-lib";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { query, where, getDocs, collection } from "firebase/firestore";
import thriveHeader from "../components/thriveHeader";

interface ReviewProps {
  username: string;
  rating: number;
  review: string;
}

const Review: React.FC<ReviewProps> = ({ username, rating, review }) => {
  const starHollowed = Array.from({ length: 5 }, (_, i) =>
    i < rating ? "star" : "star-o"
  );
  return (
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewUsername}>{username}</Text>
      <Text>
        {starHollowed.map((star, index) => (
          <FontAwesome key={index} name={star} size={20} />
        ))}
      </Text>
      <Text>{review}</Text>
    </View>
  );
};

const EditBusinessPage: React.FC = () => {
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  const route = useRoute();
  const { id } = route.params as { id: string };
  const { width } = Dimensions.get("window");
  const scale = width / 35;

  const navigation = useNavigation();

  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(FIRESTORE, "businessData"),
          where("businessID", "==", id) // 'id' here should be the businessID you are searching for
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming there's only one document per businessID
          const doc = querySnapshot.docs[0]; 
          const data = doc.data();
          setBusinessData(data);
          
        }
        else {
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
      // Query to find the business document using businessID
      const q = query(
        collection(FIRESTORE, "businessData"),
        where("businessID", "==", id) // 'id' should be the businessID from route params
      );
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Get the first document (assuming only one document per businessID)
        const docRef = querySnapshot.docs[0].ref;
  
        // Update the business data
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

  const businessName = businessData?.businessName || "";
  const businessDescription = businessData?.description || "";
  const phoneNumber = businessData?.phoneNumber || "";
  const address = businessData?.location || "";
  const schedule = businessData?.schedule || {};
  const images = businessData?.images || [];
  const reviews = businessData?.reviews || [{ username: "None", rating: null, review: "No Reviews" }];

  const numStars = reviews.length > 0 ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length : 0;

  useEffect(() => {
    if (businessData) {
      navigation.setOptions({
        headerTitle: businessName, 
        headerBackTitle: "Back",
      });
    } else {
      navigation.setOptions({
        headerTitle: "Loading...",
        headerBackTitle: "Back",
      });
    }
  }, [businessName, navigation]);

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
        <Text style={{textAlign:"center", fontSize:30, paddingVertical:20}}>Edit Business Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            value={businessName}
            onChangeText={(text) => handleInputChange("businessName", text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}  // Apply the larger input style here
            value={businessDescription}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={(text) => handleInputChange("location", text)}
          />
        </View>
        {/* Add more fields for the schedule, gallery, etc. as needed */}
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  reviewsSection: {
    marginTop: 20,
  },
  reviewContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  reviewUsername: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditBusinessPage;
