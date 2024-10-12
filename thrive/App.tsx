import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { User } from 'firebase/auth';
import { View, Text, Button, StyleSheet } from 'react-native';

// Import screens for Auth and Main flows
import LoginPage from './screens/dm-pages/login';
import SignUpPage from './screens/dm-pages/sign-up';
import ClientDashboard from './screens/dashboardPages/clientDashboard';
import SpecificBusinessPage from './screens/dm-pages/specificBusinessPage';
import DMList from './screens/dm-pages/dm-list';
import SearchResults from './screens/dm-pages/search';
import AuthLandingPage from './screens/dm-pages/auth-landing';
import SpecificDM from './screens/dm-pages/dm';
import LandingPageBusiness from './screens/dm-pages/landingPageBusiness';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

function AuthLayout() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="AuthLandingPage" component={AuthLandingPage} />
      <AuthStack.Screen name="LoginPage" component={LoginPage} />
      <AuthStack.Screen name="SignUpPage" component={SignUpPage} />
    </AuthStack.Navigator>
  );
}

// Define the HomeScreen function
function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Welcome to the App!</Text>
      <Button
        title="Go to messages"
        onPress={() => navigation.navigate('Messages')}
      />
      <Button
        title="Go to client dashboard"
        onPress={() => navigation.navigate('Dashboard')}
      />
      <Button
        title="Go to Specific Business Page"
        onPress={() =>
          navigation.navigate('Business Page', {
            businessName: 'Hyderabad Spice',
            businessDescription: 'Best Indian Food in NJ!',
            numStars: 4,
            phoneNumber: '732-526-9081',
            address: '1008 NJ-34 Suite #8, Matawan, NJ 07747',
            schedule: {
              Monday: ['9:00am', '1:00pm'],
              Tuesday: ['9:00am', '1:00pm'],
              Wednesday: ['9:00am', '1:00pm'],
              Thursday: ['9:00am', '1:00pm'],
              Friday: ['9:00am', '1:00pm'],
              Saturday: ['9:00am', '1:00pm'],
              Sunday: ['9:00am', '1:00pm'],
            },
          })
        }
      />
      <Button
        title="Go to specific DM"
        onPress={() => navigation.navigate('SpecificDM')}
      />
      <Button
        title="Go to landing page (business)"
        onPress={() => navigation.navigate('LandingPageBusiness')}
      />
      <Button
        title="Go to search"
        onPress={() => navigation.navigate('SearchResults')}
      />
      <Button
        title="Go to login page"
        onPress={() => navigation.navigate('LoginPage')}
      />
      <Button
        title="Go to sign up page"
        onPress={() => navigation.navigate('SignUpPage')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

// Main Layout after login
function MainLayout() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="HomeScreen" component={HomeScreen} />
      <MainStack.Screen name="Dashboard" component={ClientDashboard} />
      <MainStack.Screen name="SearchResults" component={SearchResults} />
      <MainStack.Screen name="Business Page" component={SpecificBusinessPage} />
      <MainStack.Screen name="Messages" component={DMList} />
      <MainStack.Screen name="SpecificDM" component={SpecificDM} />
      <MainStack.Screen name="LandingPageBusiness" component={LandingPageBusiness} />
    </MainStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainLayout" component={MainLayout} />
        ) : (
          <Stack.Screen name="AuthLayout" component={AuthLayout} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
