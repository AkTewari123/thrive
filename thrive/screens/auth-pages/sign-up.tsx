import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE } from "../../FirebaseConfig";
import thriveHeader from "../components/thriveHeader";
import BusinessSignUpPage from "./businessSignUp";

// Consistent color palette
const COLORS = {
  primary: '#6366F1',     // Main brand color (purple)
  secondary: '#4F46E5',   // Darker purple for hover states
  background: '#F3F4F6',  // Light grey background
  surface: '#FFFFFF',     // White surface
  text: {
    primary: '#1F2937',   // Dark grey for primary text
    secondary: '#6B7280', // Medium grey for secondary text
    inverse: '#FFFFFF',   // White text
  },
  border: '#E5E7EB',      // Light grey for borders
  error: '#EF4444',       // Red for errors
  success: '#10B981',     // Green for success states
};

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    location: "",
    establishmentDate: "",
    services: "",
    menuPdf: null,
    phoneNumber: "",
    description: "",
    businessID: "",
    uid: "",
  });

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
  };

  const handleSignUp = async () => {
    if (!email || !password || !userType) {
      Alert.alert("Error", "Please fill in all fields and select a user type.");
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;
      const colors = [COLORS.success, COLORS.error, COLORS.primary, COLORS.secondary];
      
      await setDoc(doc(FIRESTORE, "users", user.uid), {
        email: user.email,
        userType: userType,
        createdAt: new Date(),
        col: colors[Math.floor(Math.random() * colors.length)],
      });

      if (userType === "Business") {
        await setDoc(doc(FIRESTORE, "businessData", user.uid), {
          ...businessDetails,
          createdAt: new Date(),
          businessID: businessDetails.businessID,
          uid: user.uid,
        });

        await setDoc(
          doc(FIRESTORE, "users", user.uid),
          { businessID: businessDetails.businessID },
          { merge: true } // This ensures the businessID is added to the user doc without overwriting other fields
        );
  
      }

      Alert.alert("Success", `Account created as ${userType}!`);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.signupContainer}>
        {thriveHeader({})}
        
        <View style={styles.welcomeContainer}>
          <MaterialCommunityIcons name="account-plus" size={40} color={COLORS.primary} />
          <Text style={styles.welcomeText}>Welcome</Text>
        </View>

        <Text style={styles.subtitle}>I'm a...</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.typeButton, userType === "Business" && styles.selectedButton]}
            onPress={() => handleUserTypeSelection("Business")}
          >
            <MaterialCommunityIcons 
              name="store" 
              size={24} 
              color={userType === "Business" ? COLORS.text.inverse : COLORS.text.primary} 
            />
            <Text style={[styles.typeButtonText, userType === "Business" && styles.selectedButtonText]}>
              Business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, userType === "Customer" && styles.selectedButton]}
            onPress={() => handleUserTypeSelection("Customer")}
          >
            <MaterialCommunityIcons 
              name="account" 
              size={24} 
              color={userType === "Customer" ? COLORS.text.inverse : COLORS.text.primary} 
            />
            <Text style={[styles.typeButtonText, userType === "Customer" && styles.selectedButtonText]}>
              Customer
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Create an Account</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.text.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.text.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color={COLORS.text.secondary} 
            />
          </TouchableOpacity>
        </View>

        {userType === "Business" && (
          <BusinessSignUpPage
            businessDetails={businessDetails}
            setBusinessDetails={setBusinessDetails}
          />
        )}

        <TouchableOpacity
          style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <MaterialCommunityIcons name="loading" size={24} color={COLORS.text.inverse} />
          ) : (
            <>
              <MaterialCommunityIcons name="account-check" size={24} color={COLORS.text.inverse} />
              <Text style={styles.actionButtonText}>Sign Up</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  signupContainer: {
    padding: 32,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text.secondary,
    marginBottom: 24,
    fontWeight: "500",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    width: "100%",
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    gap: 8,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 16,
    color: COLORS.text.primary,
    fontWeight: "600",
  },
  selectedButtonText: {
    color: COLORS.text.inverse,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  passwordToggle: {
    padding: 12,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.text.secondary,
  },
  actionButtonText: {
    color: COLORS.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SignUpPage;