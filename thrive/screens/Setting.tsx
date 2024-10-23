import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import Feather from "@expo/vector-icons/Feather";
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { UserContext } from '../UserContext';
import thriveHeader from './components/thriveHeader';

const SettingsPage = () => {
  const { user, setUser, userType, setUserType } = useContext(UserContext);

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        console.log('User signed out');
        setUser(null);
        setUserType(null);
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  const SettingItem = ({ icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Feather name={icon} size={24} color="#5A5D9D" />
      <Text style={styles.settingItemText}>{title}</Text>
      <Feather name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {thriveHeader({})}
        <View style={styles.userInfoSection}>
          <View style={styles.profileCircle}>
            <Text style={styles.initialText}>{user?.email[0]}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userType}>{userType || 'User Type'} Account</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem icon="user" title="Edit Profile" onPress={() => { }} />
          <SettingItem icon="lock" title="Change Password" onPress={() => { }} />
          <SettingItem icon="bell" title="Notifications" onPress={() => { }} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="white" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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

  headerTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    color: "white",
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A5D9D',
    padding: 16,
    marginBottom: 20,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userDetails: {
    marginLeft: 16,
  },
  userName: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    color: "#1F2937",
  },
  userEmail: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: "white",
  },
  userType: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: "white",
    marginTop: 4,
  },
  settingsSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 18,
    color: "#374151",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  settingItemText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    color: "#1F2937",
    flex: 1,
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: "#EE4957",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  profileCircle: {
    backgroundColor: '#FFFFFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: '#8B5CF6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutText: {
    fontFamily: 'Outfit-Bold',
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SettingsPage;