import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE } from '../../FirebaseConfig';
import thriveHeader from '../components/thriveHeader';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(''); // Track selected user type
  const [isLoading, setIsLoading] = useState(false);

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
  };

  const handleSignUp = async () => {
    if (!email || !password || !userType) {
      Alert.alert('Error', 'Please fill in all fields and select a user type.');
      return;
    }

    try {
      setIsLoading(true);
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(FIRESTORE, 'users', user.uid), {
        email: user.email,
        userType: userType,
        createdAt: new Date(),
      });

      Alert.alert('Success', `Account created as ${userType}!`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.signupContainer}>
        {thriveHeader({})}
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

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.actionButton} onPress={handleSignUp} disabled={isLoading}>
          <Text style={styles.actionButtonText}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Text>
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
  input: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
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
});

export default SignUpPage;
