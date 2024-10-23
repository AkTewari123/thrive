import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import thriveHeader from '../components/thriveHeader';

// Using the same color palette as SignUpPage
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
};

const AuthLandingPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.authContainer}>
          {thriveHeader({})}
          
          <View style={styles.welcomeContainer}>
            <MaterialCommunityIcons name="hand-wave" size={40} color={COLORS.primary} />
            <Text style={styles.welcomeText}>Welcome!</Text>
          </View>

          <Text style={styles.subtitle}>
            Please log in or sign up to continue
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('LoginPage')}
          >
            <MaterialCommunityIcons 
              name="login" 
              size={24} 
              color={COLORS.text.inverse} 
            />
            <Text style={styles.actionButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('SignUpPage')}
          >
            <MaterialCommunityIcons 
              name="account-plus" 
              size={24} 
              color={COLORS.text.inverse} 
            />
            <Text style={styles.actionButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
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
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: "500",
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AuthLandingPage;