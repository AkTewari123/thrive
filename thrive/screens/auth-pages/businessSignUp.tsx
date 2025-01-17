import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect } from "react";

interface BusinessDetails {
  businessName: string;
  location: string;
  services: string;
  menuPdf: any;
  phoneNumber: string;
  description: string;
  businessID: string;
  uid: string;
  establishmentDate: string;
}

interface BusinessSignUpPageProps {
  businessDetails: BusinessDetails;
  setBusinessDetails: React.Dispatch<React.SetStateAction<BusinessDetails>>;
}

const BusinessSignUpPage: React.FC<BusinessSignUpPageProps> = ({
  businessDetails,
  setBusinessDetails,
}) => {

  // Function to generate a unique BusinessID
  const generateBusinessID = () => {
    return `BUS-${Date.now()}`; // Simple timestamp-based ID
  };

  // Initialize the BusinessID on component mount if not already set
  useEffect(() => {
    if (!businessDetails.businessID) {
      setBusinessDetails((prevState) => ({
        ...prevState,
        businessID: generateBusinessID(),
      }));
    }
  }, []);
  const handleInputChange = (name: keyof BusinessDetails, value: string) => {
    setBusinessDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePdfUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!result.canceled) {
        setBusinessDetails((prevState) => ({
          ...prevState,
          menuPdf: result,
        }));
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={businessDetails.businessName}
        onChangeText={(value) => handleInputChange("businessName", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={businessDetails.location}
        onChangeText={(value) => handleInputChange("location", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Phone Number"
        value={businessDetails.phoneNumber}
        onChangeText={(value) => handleInputChange("phoneNumber", value)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Establishment Date"
        value={businessDetails.establishmentDate}
        onChangeText={(value) => handleInputChange("establishmentDate", value)}
      />
      <TextInput
        style={styles.inputBottom}
        placeholder="Brief Description"
        value={businessDetails.description}
        onChangeText={(value) => handleInputChange("description", value)}
        keyboardType="phone-pad"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 16,
  },
  inputBottom: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#6366F1",
  },
  fileName: {
    fontSize: 14,
    color: "#6366F1",
    marginBottom: 16,
  },
});

export default BusinessSignUpPage;
