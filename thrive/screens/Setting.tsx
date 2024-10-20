import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Feather from "@expo/vector-icons/Feather";
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { UserContext } from '../UserContext'; // Import the context

const SettingsPage = () => {
  const { setUser, setUserType } = useContext(UserContext); // Access the context

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        console.log('User signed out');
        setUser(null); // Reset user in context
        setUserType(null); // Reset userType in context
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Your other UI code */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
        <Feather name="log-out" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#E4E8EE",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 10,
        flex: 1,
    },
    sectionHeader: {
        fontFamily: 'Outfit-Medium',
        fontSize: 35,
        fontWeight: "800",
        color: "#1F2937",
        textAlign: "center",
        marginTop: 24,
        backgroundColor: "white",
        paddingVertical: 10,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
    },
    itemName: {
        fontFamily: 'Outfit-SemiBold',
        fontSize: 16,
        color: "#1F2937",
        flex: 1,
        marginLeft: 12,
    },
    logoutButton: {
        backgroundColor: "#EE4957",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
    },
    logoutText: {
        fontFamily: 'Outfit-Bold',
        color: "white",
        fontSize: 16,
        marginRight: 8,
    },
});

export default SettingsPage;