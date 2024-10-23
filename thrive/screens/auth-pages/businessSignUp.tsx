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

interface BusinessDetails {
  businessName: string;
  location: string;
  establishmentDate: string;
  services: string;
  menuPdf: any;
  phoneNumber: string;
  description: string;
}

interface BusinessSignUpPageProps {
  businessDetails: BusinessDetails;
  setBusinessDetails: React.Dispatch<React.SetStateAction<BusinessDetails>>;
}

const BusinessSignUpPage: React.FC<BusinessSignUpPageProps> = ({
  businessDetails,
  setBusinessDetails,
}) => {
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
        placeholder="Date of Establishment"
        value={businessDetails.establishmentDate}
        onChangeText={(value) => handleInputChange("establishmentDate", value)}
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
        placeholder="Brief Description"
        maxLength={15}
        value={businessDetails.description}
        onChangeText={(value) => handleInputChange("description", value)}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handlePdfUpload}>
        <FontAwesome name="file-pdf-o" size={24} color="#6366F1" />
        <Text style={styles.uploadButtonText}>
          {businessDetails.menuPdf
            ? "Change Menu/Product List PDF"
            : "Upload Menu/Product List PDF"}
        </Text>
      </TouchableOpacity>
      {businessDetails.menuPdf && !businessDetails.menuPdf.canceled && (
        <Text style={styles.fileName}>{businessDetails.menuPdf.name}</Text>
      )}
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
