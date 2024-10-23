import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import thriveHeader from "../components/thriveHeader";

// Consistent color palette (matching signup page)
const COLORS = {
  primary: "#6366F1", // Main brand color (purple)
  secondary: "#4F46E5", // Darker purple for hover states
  background: "#F3F4F6", // Light grey background
  surface: "#FFFFFF", // White surface
  text: {
    primary: "#1F2937", // Dark grey for primary text
    secondary: "#6B7280", // Medium grey for secondary text
    inverse: "#FFFFFF", // White text
  },
  border: "#E5E7EB", // Light grey for borders
  error: "#EF4444", // Red for errors
  success: "#10B981", // Green for success states
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user);
    } catch (error: any) {
      console.error("Error during login:", error.message);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        {thriveHeader({})}
        <View style={styles.welcomeContainer}>
          <MaterialCommunityIcons
            name="login"
            size={40}
            color={COLORS.primary}
          />
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>

        <Text style={styles.subtitle}>Log in to your account</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email"
            size={20}
            color={COLORS.text.secondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Ex. john@example.com"
            placeholderTextColor={COLORS.text.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="lock"
            size={20}
            color={COLORS.text.secondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
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

        <TouchableOpacity
          style={[styles.forgotPassword]}
          onPress={() =>
            Alert.alert(
              "Info",
              "Password reset functionality to be implemented"
            )
          }
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, loading && styles.actionButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <MaterialCommunityIcons
              name="loading"
              size={24}
              color={COLORS.text.inverse}
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="login"
                size={24}
                color={COLORS.text.inverse}
              />
              <Text style={styles.actionButtonText}>Log In</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => Alert.alert("Info", "Navigate to sign up page")}
        >
          <Text style={styles.signUpButtonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
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
    alignItems: "center",
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.text.secondary,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  signUpButton: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
  },
  signUpButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginPage;
