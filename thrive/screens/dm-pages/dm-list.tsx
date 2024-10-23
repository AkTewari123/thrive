import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import thriveHeader from "../components/thriveHeader";
import { useNavigation } from "@react-navigation/native";
import BusinessNavBar from "../components/businessNavbar";
import { RouteProp, ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  where,
} from "firebase/firestore";

import { FIRESTORE } from "../../FirebaseConfig";

// Define the param list for your stack
type RootStackParamList = {
  DMList: undefined; // No params for DMList
  SpecificDM: { otherUserEmail: string; color?: string }; // Pass otherUserEmail param
};
const updateUserColorIfNull = async (userEmail: string, color: string) => {
  try {
    // Query to find the user document by email
    const userQuery = query(
      collection(FIRESTORE, "users"),
      where("email", "==", userEmail)
    );

    const querySnapshot = await getDocs(userQuery);

    // Check if we found the user
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();

        // Check if the color is null
        if (userData.color == null) {
          // Update the user's color
          await updateDoc(userDoc.ref, {
            color: color,
          });
          console.log("color");
          console.log(`Updated color for user: ${userEmail}`);
        }
      });
    } else {
      console.error("User not found");
    }
  } catch (error) {
    console.error("Error updating user color:", error);
  }
};
interface BusinessItemProps {
  name: string;
  description: string;
  initial: string;
  color: string;
  onPress: () => void;
}

const BusinessItem: React.FC<BusinessItemProps> = ({
  name,
  description,
  initial,
  onPress,
  color,
}) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={[styles.initialCircle, { backgroundColor: color }]}>
      <Text style={styles.initialText}>{initial}</Text>
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
    </View>
    <Text style={styles.arrowRight}>
      <Feather name="arrow-right-circle" size={32} color="black" />
    </Text>
  </TouchableOpacity>
);

const FloatingActionButton: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <View style={styles.fabIconContainer}>
        <Feather name="message-square" size={24} color="white" />
      </View>
      <Text style={styles.fabText}>New Chat</Text>
    </TouchableOpacity>
  );
};

type DMListNavigationProp = StackNavigationProp<RootStackParamList, "DMList">;

const DMList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dmList, setDmList] = useState<
    { name: string; email: string; color: string }[]
  >([]);

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
      navigation.navigate("SpecificDM", {
        otherUserEmail: email.trim(),
        color: ["#14b8a6", "#4f46e5", "#047857", "#881337"][
          Math.floor(Math.random() * 3)
        ],
      });
    }
  };

  useEffect(() => {
    const fetchDMs = async () => {
      if (!user?.email) return;

      try {
        const q = query(collection(FIRESTORE, "messages"));
        const users = query(collection(FIRESTORE, "users"));
        const userSnapshot = await getDocs(users);
        const querySnapshot = await getDocs(q);
        const dmData: { name: string; email: string; color: string }[] = [];

        querySnapshot.forEach((doc) => {
          const docId = doc.id;
          if (docId.includes(user.email!)) {
            const participants = docId.split("&");
            let color = ["#14b8a6", "#4f46e5", "#047857", "#881337"][
              Math.floor(Math.random() * 3)
            ];
            console.log(color);
            const otherUserEmail =
              participants[0] === user.email
                ? participants[1]
                : participants[0];
            userSnapshot.forEach((ref) => {
              const user = ref.data();
              if (user.email === otherUserEmail && user.color != null) {
                color = user.color;
              } else {
                updateUserColorIfNull(otherUserEmail, color);
              }
            });
            dmData.push({
              name: otherUserEmail.split("@")[0], // You can adjust this to fetch name from a different field
              email: otherUserEmail,
              color: color,
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
        {dmList.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Feather name="message-square" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No chats yet</Text>
            <Text style={styles.emptyStateSubText}>
              Start a new chat to begin messaging
            </Text>
          </View>
        ) : (
          dmList.map((dm) => (
            <BusinessItem
              key={dm.email}
              name={dm.name}
              color={dm.color}
              description={`Chat with ${dm.name}`}
              initial={dm.name.charAt(0).toUpperCase()}
              onPress={() =>
                navigation.navigate("SpecificDM", {
                  otherUserEmail: dm.email,
                  color: dm.color,
                })
              }
            />
          ))
        )}
      </ScrollView>

      <FloatingActionButton onPress={handleNewChat} />

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
            <TouchableOpacity
              style={styles.modalButton}
              onPress={startChatWithEmail}
            >
              <Text style={styles.modalButtonText}>Start Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
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
    backgroundColor: "#E4E8EE",
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90, // Adjust this value to move it above the navbar
    backgroundColor: "#5A5D9D",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIconContainer: {
    marginRight: 8,
  },
  fabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  itemDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  arrowRight: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#5A5D9D",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 12,
    padding: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  emptyStateSubText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
});

export default DMList;
