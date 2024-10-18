import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword
import { FIREBASE_AUTH } from '../../FirebaseConfig'; // Import your Firebase config
import thriveHeader from '../components/thriveHeader';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Optional: handle loading state

  const handleLogin = async () => {
    setLoading(true); // Start loading
    try {
      // Use Firebase signInWithEmailAndPassword function
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      console.log('User signed in:', user);
      // Handle successful login, such as navigation to the main page
    } catch (error: any) {
      console.error('Error during login:', error.message);
      Alert.alert('Login Failed', error.message); // Show error message to user
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        {thriveHeader({})}
        <Text style={styles.subtitle}>Log In/Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex. john@example.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]} // Disable button during loading
          onPress={handleLogin}
          disabled={loading} // Disable button during loading
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Dark background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    padding: 32,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 24,
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
  button: {
    backgroundColor: '#6366F1', // Purple button color
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginPage;
