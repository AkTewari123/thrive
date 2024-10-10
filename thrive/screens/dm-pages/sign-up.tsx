import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const SignUpPage: React.FC = () => {
  const [userType, setUserType] = useState(''); // Track selected user type

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
  };

  return (
    <View style={styles.container}>
      <View style={styles.signupContainer}>
        {/* <Image source={require('./path/to/rocket_icon.png')} style={styles.logo} /> */}
        <Text style={styles.title}>thrive</Text>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subtitle}>I'm a...</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              userType === 'Business' && styles.selectedButton,
            ]}
            onPress={() => handleUserTypeSelection('Business')}
          >
            <Text
              style={[
                styles.typeButtonText,
                userType === 'Business' && styles.selectedButtonText,
              ]}
            >
              Business
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              userType === 'Customer' && styles.selectedButton,
            ]}
            onPress={() => handleUserTypeSelection('Customer')}
          >
            <Text
              style={[
                styles.typeButtonText,
                userType === 'Customer' && styles.selectedButtonText,
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Create an Account</Text>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>Or</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Light grey background
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    padding: 32,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#D1D5DB', // Default grey button color
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  selectedButton: {
    backgroundColor: '#6366F1', // Purple color when selected
  },
  typeButtonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: 'white', // Text color for selected button
  },
  actionButton: {
    backgroundColor: '#6366F1', // Purple button color
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    color: '#6B7280',
    marginVertical: 12,
  },
});

export default SignUpPage;
