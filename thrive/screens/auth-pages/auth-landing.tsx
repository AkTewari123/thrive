import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import thriveHeader from '../components/thriveHeader'; // Assuming this component exists
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthLandingPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <>
    <SafeAreaView></SafeAreaView>
    <View style={styles.container}>
      <View style={styles.authContainer}>
        {thriveHeader({})}
        <Text style={styles.subtitle}>Welcome!</Text>
        <Text style={styles.description}>Please log in or sign up to continue</Text>

        {/* Button to navigate to Log In page */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginPage')}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        {/* Button to navigate to Sign Up page */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUpPage')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthLandingPage;
