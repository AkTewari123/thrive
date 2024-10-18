import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import thriveHeader from "../components/thriveHeader";
import { useNavigation } from '@react-navigation/native';
import BusinessNavBar from '../components/businessNavbar';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { collection, query, getDocs } from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";

// Define the param list for your stack
type RootStackParamList = {
  DMList: undefined; // No params for DMList
  SpecificDM: { otherUserEmail: string }; // Pass otherUserEmail param
};


interface BusinessItemProps {
  name: string;
  description: string;
  initial: string;
  onPress: () => void;
}

const BusinessItem: React.FC<BusinessItemProps> = ({ name, description, initial, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={[styles.initialCircle, { backgroundColor: initial === 'H' ? '#8B5CF6' : '#22C55E' }]}>
      <Text style={styles.initialText}>{initial}</Text>
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
    </View>
    <Text style={styles.arrowRight}>
      <Feather name="arrow-right-circle" size={32} color='black' />
    </Text>
  </TouchableOpacity>
);

const FloatingActionButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <View style={styles.fabIconContainer}>
        <Feather name="message-square" size={24} color="white" />
      </View>
      <Text style={styles.fabText}>New Chat</Text>
    </TouchableOpacity>
  );
};

type DMListNavigationProp = StackNavigationProp<RootStackParamList, 'DMList'>;

const DMList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dmList, setDmList] = useState<{ name: string; email: string }[]>([]);

  const navigation = useNavigation<DMListNavigationProp>(); // Type the useNavigation hook
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;


  const handleNewChat = () => {
    setModalVisible(true); // Show the modal to enter an email
  };

  const startChatWithEmail = () => {
    if (email.trim()) {
      setModalVisible(false);
      setEmail(""); // Clear the input
      // Navigate to SpecificDM with the entered email
      navigation.navigate('SpecificDM', { otherUserEmail: email.trim() });
    }
  };

  useEffect(() => {
    const fetchDMs = async () => {
      if (!user?.email) return;

      try {
        const q = query(collection(FIRESTORE, "messages"));
        const querySnapshot = await getDocs(q);
        const dmData: { name: string; email: string }[] = [];

        querySnapshot.forEach((doc) => {
          const docId = doc.id;
          if (docId.includes(user.email!)) {
            const participants = docId.split("&");
            const otherUserEmail =
              participants[0] === user.email ? participants[1] : participants[0];
            dmData.push({
              name: otherUserEmail.split("@")[0], // You can adjust this to fetch name from a different field
              email: otherUserEmail,
            });
          }
        });

        setDmList(dmData);
      } catch (error) {
        console.error("Error fetching DMs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDMs();
  }, [user]);


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }




  return (
    <SafeAreaView style={styles.container}>
      {thriveHeader({})}

      <ScrollView style={styles.content}>
      {dmList.map((dm) => (
          <BusinessItem
            key={dm.email}
            name={dm.name}
            description={`Chat with ${dm.name}`}
            initial={dm.name.charAt(0).toUpperCase()}
            onPress={() =>
              navigation.navigate("SpecificDM", { otherUserEmail: dm.email })
            }
          />
        ))}
      </ScrollView>

      {/* New Chat Floating Button */}
      <FloatingActionButton onPress={handleNewChat} />

      {/* Navigation Bar */}
      <BusinessNavBar navigation={navigation} />

      {/* Modal for Email Input */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Email to Start Chat</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.modalButton} onPress={startChatWithEmail}>
              <Text style={styles.modalButtonText}>Start Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E8EE',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Adjust this value to move it above the navbar
    backgroundColor: '#5A5D9D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIconContainer: {
    marginRight: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrowRight: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#5A5D9D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 12,
    padding: 8,
  },
});

export default DMList;
