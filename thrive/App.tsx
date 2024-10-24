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
import BusinessOrdersPage from "./screens/dashboardPages/businessOrdersPage";
import { CombinedCharts } from "./screens/dashboardPages/graphs";

// Import your screens here
import LoginPage from "./screens/auth-pages/login";
import SignUpPage from "./screens/auth-pages/sign-up";
import ClientDashboard from "./screens/dashboardPages/clientDashboard";
import SpecificBusinessPage from "./screens/find-company/specificBusinessPage";
import DMList from "./screens/dm-pages/dm-list";
import SearchResults from "./screens/find-company/search";
import AuthLandingPage from "./screens/auth-pages/auth-landing";
import SpecificDM from "./screens/dm-pages/dm";
import LandingPageBusiness from "./screens/dashboardPages/landingPageBusiness";
import SettingsPage from "./screens/Setting";
import BusinessSignUpPage from "./screens/auth-pages/businessSignUp";
import EditBusinessPage from "./screens/dashboardPages/editBusinessPage";

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const CustomerStack = createStackNavigator();
const BusinessStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const BusinessTab = createBottomTabNavigator();

function BusinessTabNavigator() {
  return (
    <BusinessTab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Businesses") {
            iconName = "briefcase";
          } else if (route.name === "Posts") {
            iconName = "book";
          } else if (route.name === "Messages") {
            iconName = "message-square";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          return <Feather name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarStyle: {
          position: "absolute", // Make the tab bar float
          backgroundColor: "#5A5D9D",
          borderTopWidth: 0,
          height: 50,
          paddingBottom: 10,
          paddingTop: 10,
          bottom: 20, // Adjust the position from the bottom
          left: 20,   // Add some margin from the sides to create floating space
          right: 20,
          borderRadius: 40,
          shadowColor: "#000", // Add shadow for elevation effect
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5, // For Android devices
        },
        tabBarLabelStyle: {
          fontSize: 7,
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
        options={{ title: "Business Page" }}
      />
      <BusinessStack.Screen
        name="EditBusinessPage"
        component={EditBusinessPage}
        options={{ title: "Business Page" }}
      />
      <BusinessStack.Screen
        name="BusinessOrdersPage"
        component={BusinessOrdersPage}
        options={{ title: "Business Page" }}
      />
      <BusinessStack.Screen
        name="SpecificDM"
        component={SpecificDM}
        options={{ title: "Chat" }}
      />
      <BusinessStack.Screen
        name="Graphs"
        component={CombinedCharts}
        options={{ title: 'Graphs' }}
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
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Dashboard") {
            iconName = "home";
          } else if (route.name === "Businesses") {
            iconName = "search";
          } else if (route.name === "Messages") {
            iconName = "message-square";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          return <Feather name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarStyle: {
          position: "absolute", // Make the tab bar float
          backgroundColor: "#5A5D9D",
          borderTopWidth: 0,
          height: 50,
          paddingBottom: 10,
          paddingTop: 10,
          bottom: 20, // Adjust the position from the bottom
          left: 20,   // Add some margin from the sides to create floating space
          right: 20,
          borderRadius: 40,
          shadowColor: "#000", // Add shadow for elevation effect
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5, // For Android devices
        },
        tabBarLabelStyle: {
          fontSize: 7,
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
        name="SpecificBusinessPage"
        component={SpecificBusinessPage}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#5A5D9D",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
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
