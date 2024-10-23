import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE } from "./FirebaseConfig";
import { User } from "firebase/auth";
import { View, Text, Button, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import Feather from "@expo/vector-icons/Feather";
import { UserProvider, UserContext } from "./UserContext"; // Import the provider
import { CompanyPosts } from "./screens/posts/createPosts";
import { CompanyPostHistory } from "./screens/posts/viewCompanyPosts";

// Import your screens here
import LoginPage from './screens/auth-pages/login';
import SignUpPage from './screens/auth-pages/sign-up';
import ClientDashboard from './screens/dashboardPages/clientDashboard';
import SpecificBusinessPage from './screens/find-company/specificBusinessPage';
import DMList from './screens/dm-pages/dm-list';
import SearchResults from './screens/find-company/search';
import AuthLandingPage from './screens/auth-pages/auth-landing';
import SpecificDM from './screens/dm-pages/dm';
import LandingPageBusiness from './screens/dashboardPages/landingPageBusiness';
import SettingsPage from './screens/Setting';
import BusinessSignUpPage from './screens/auth-pages/businessSignUp';
import EditBusinessPage from './screens/dashboardPages/editBusinessPage';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const CustomerStack = createStackNavigator();
const BusinessStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const BusinessTab = createBottomTabNavigator();

function BusinessTabNavigator() {
  return (
    <BusinessTab.Navigator
      initialRouteName="Dashboard" // Add this line
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Businesses") {
            iconName = "briefcase";
          } else if (route.name === "Messages") {
            iconName = "message-square";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarStyle: {
          backgroundColor: "#5A5D9D",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <BusinessTab.Screen name="Dashboard" component={LandingPageBusiness} />
      <BusinessTab.Screen name="Messages" component={DMList} />
      <Tab.Screen name="Posts" component={CompanyPosts} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </BusinessTab.Navigator>
  );
}

function BusinessLayout() {
  return (
    <BusinessStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#5A5D9D",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <BusinessStack.Screen 
        name="BusinessTabs" 
        component={BusinessTabNavigator} 
        options={{ headerShown: false }}
      />
      <BusinessStack.Screen 
        name="BusinessPage" 
        component={SpecificBusinessPage} 
        options={{ title: 'Business Page' }}
      />
      <BusinessStack.Screen 
        name="EditBusinessPage" 
        component={EditBusinessPage} 
        options={{ title: 'Business Page' }}
      />
      <BusinessStack.Screen 
        name="SpecificDM" 
        component={SpecificDM} 
        options={{ title: 'Chat' }}
      />
    </BusinessStack.Navigator>
  );
}

function AuthLayout() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="AuthLandingPage" component={AuthLandingPage} />
      <AuthStack.Screen name="LoginPage" component={LoginPage} />
      <AuthStack.Screen name="SignUpPage" component={SignUpPage} />
    </AuthStack.Navigator>
  );
}

function CustomerTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard" // Add this line
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Businesses") {
            iconName = "briefcase";
          } else if (route.name === "Messages") {
            iconName = "message-square";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          return <Feather name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarStyle: {
          backgroundColor: "#5A5D9D",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Messages" component={DMList} />
      <Tab.Screen name="Dashboard" component={ClientDashboard} />
      <Tab.Screen name="Businesses" component={SearchResults} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
}

function CustomerLayout() {
  return (
    <CustomerStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Dashboard"
    >
      <CustomerStack.Screen
        name="CustomerTabs"
        component={CustomerTabNavigator}
      />
      <CustomerStack.Screen name="SpecificDM" component={SpecificDM} />
      <CustomerStack.Screen
        name="SpecificBusiness"
        component={SpecificBusinessPage}
      />
      <CustomerStack.Screen
        name="CompanyPostHistory"
        component={CompanyPostHistory}
      />
    </CustomerStack.Navigator>
  );
}

function MainApp() {
  const { setUser, setUserType, user, userType } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setUser(user);

        const userDoc = await getDoc(doc(FIRESTORE, "users", user.uid));
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType);
        } else {
          console.log("No such document!");
        }
      } else {
        setUserType(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          userType === "Business" ? (
            <Stack.Screen name="BusinessLayout" component={BusinessLayout} />
          ) : (
            <Stack.Screen name="CustomerLayout" component={CustomerLayout} />
          )
        ) : (
          <Stack.Screen name="AuthLayout" component={AuthLayout} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
