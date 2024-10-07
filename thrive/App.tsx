import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DMList from './screens/dm-pages/dm-list';
import SpecificDM from './screens/dm-pages/dm';
import LandingPageBusiness from './screens/dm-pages/landingPageBusiness';
import SearchResults from './screens/dm-pages/search';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button
        title="Go to messages"
        onPress={() => navigation.navigate('Messages')}
      />
      <Button
        title="Go to specificMD"
        onPress={() => navigation.navigate('SpecificDM')}
      />
      <Button
        title="Go to landing page (business)"
        onPress={() => navigation.navigate('landing-page-business')}
      />
      <Button 
        title="Go to search"
        onPress={() => navigation.navigate('SearchResults')}
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
        <Stack.Screen name="landing-page-business" component={LandingPageBusiness} />
        <Stack.Screen name="SearchResults" component={SearchResults} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});