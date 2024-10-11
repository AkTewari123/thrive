import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import SpecificDM from "./screens/dm-pages/dm";
import LandingPageBusiness from "./screens/dm-pages/landingPageBusiness";
import SearchResults from "./screens/dm-pages/search";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DMList from "./screens/dm-pages/dm-list";
import ClientDashboard from "./screens/dashboardPages/clientDashboard";
import SpecificBusinessPage from "./screens/dm-pages/specificBusinessPage";
import LoginPage from "./screens/dm-pages/login";
import SignUpPage from "./screens/dm-pages/sign-up";

const Stack = createStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button
        title="Go to messages"
        onPress={() => navigation.navigate("Messages")}
      />
      <Button
        title="Go to client dashboard"
        onPress={() => navigation.navigate("Dashboard")}
      />
      <Button
        title="Go to Specific Business Page"
        onPress={() =>
          navigation.navigate("Business Page", {
            businessName: "Hyderabad Spice",
            businessDescription: "Best Indian Food in NJ!",
            numStars: 4,
            phoneNumber: "732-526-9081",
            address: "1008 NJ-34 Suite #8, Matawan, NJ 07747",
            schedule: {
              Monday: ["9:00am", "1:00pm"],
              Tuesday: ["9:00am", "1:00pm"],
              Wednesday: ["9:00am", "1:00pm"],
              Thursday: ["9:00am", "1:00pm"],
              Friday: ["9:00am", "1:00pm"],
              Saturday: ["9:00am", "1:00pm"],
              Sunday: ["9:00am", "1:00pm"],
            },
          })
        }
      />
      <Button
        title="Go to specificMD"
        onPress={() => navigation.navigate("SpecificDM")}
      />
      <Button
        title="Go to landing page (business)"
        onPress={() => navigation.navigate("Landing-page-business")}
      />
      <Button
        title="Go to search"
        onPress={() => navigation.navigate("SearchResults")}
      />
      <Button
        title="Go to example business page"
        onPress={() => navigation.navigate("Example-business-page")}
      />
      <Button
        title="Go to login page"
        onPress={() => navigation.navigate("LoginPage")}
      />
      <Button
        title="Go to sign up page"
        onPress={() => navigation.navigate("SignUpPage")}
      />
      <StatusBar style="auto" />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Messages" component={DMList} />
        <Stack.Screen name="SpecificDM" component={SpecificDM} />
        <Stack.Screen
          name="Landing-page-business"
          component={LandingPageBusiness}
        />
        <Stack.Screen name="SearchResults" component={SearchResults} />
        <Stack.Screen
          name="Example-business-page"
          component={SpecificBusinessPage}
        />
        <Stack.Screen name="Dashboard" component={ClientDashboard} />
        <Stack.Screen name="Business Page" component={SpecificBusinessPage} />
        <Stack.Screen
          name="Example-business-page"
          component={SpecificBusinessPage}
        />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="SignUpPage" component={SignUpPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
