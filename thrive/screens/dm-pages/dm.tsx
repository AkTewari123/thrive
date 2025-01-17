import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import {
  setDoc,
  getDoc,
  doc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth"; // Firebase auth for current user

interface MessageProps {
  content?: string;
  isUser: boolean;
  attachment?: string;
}

const Message: React.FC<MessageProps> = ({ content, isUser, attachment }) => (
  <View
    style={[
      styles.messageContainer,
      isUser ? styles.userMessage : styles.otherMessage,
    ]}
  >
    {content && (
      <Text
        style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.otherMessageText,
        ]}
      >
        {content}
      </Text>
    )}
    {attachment && (
      <View style={styles.attachmentContainer}>
        <Feather name="paperclip" size={16} color="#6B7280" />
        <Text style={styles.attachmentText}>{attachment}</Text>
      </View>
    )}
  </View>
);

const SpecificDM: React.FC = () => {
  const auth = getAuth();
  const currentUserEmail = auth.currentUser?.email; // Get the current user's email
  const route = useRoute();
  const navigation = useNavigation();
  const { otherUserEmail } = route.params as { otherUserEmail: string }; // Get the other user's email from route params
  const { color } = route.params as { color: string }; // Get the other user's email from route params
  // Use both emails to create the Firestore document ID (sort alphabetically to ensure consistency)
  console.log(color);
  const docId =
    currentUserEmail && otherUserEmail
      ? [currentUserEmail, otherUserEmail].sort().join("&")
      : null;
  const docRef = doc(FIRESTORE, "messages", docId || "default");

  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Array<{ [key: string]: string }>>(
    []
  );
  const [text, setText] = useState("");

  useEffect(() => {
    if (docId) {
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const chatData = docSnap.data().chat || [];
          setMessages(chatData);
          scrollToBottom();
        }
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [docId]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 0);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      scrollToBottom
    );
    scrollToBottom();

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [scrollToBottom]);

  const handleSend = async (text: string) => {
    if (text.trim() && currentUserEmail) {
      text = text.trim();

      // Dynamically generate the message key using the current user's email
      const newMessage = { [currentUserEmail]: text };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setText("");

      try {
        const docSnap = await getDoc(docRef); // Check if the document exists
        if (docSnap.exists()) {
          // If document exists, update the chat
          await updateDoc(docRef, {
            chat: [...messages, newMessage],
          });
        } else {
          // If document does not exist, create a new one with setDoc
          await setDoc(docRef, {
            chat: [...messages, newMessage],
          });
        }
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const renderMessages = useMemo(() => {
    return messages.map((messageMap, index) => {
      const [sender, message] = Object.entries(messageMap)[0];
      const isUser = sender === currentUserEmail; // Check if it's the current user
      let hasAttachment = message.includes("attachment908(");
      return !hasAttachment ? (
        <Message key={index} content={message} isUser={isUser} />
      ) : (
        <Message key={index} isUser={isUser} attachment="Menu.pdf" />
      );
    });
  }, [messages, currentUserEmail]);

  return (
    <>
      <SafeAreaView></SafeAreaView>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerProfile}>
            <View style={[styles.avatarContainer, { backgroundColor: color }]}>
              <Text style={styles.avatarText}>
                {otherUserEmail.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.headerName}>{otherUserEmail}</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onContentSizeChange={scrollToBottom}
        >
          {renderMessages}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            style={styles.input}
            placeholder="Enter Message"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSend(text)}
          >
            <Feather name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  messageListContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerProfile: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerName: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#5A5D9D",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  userMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "black",
  },
  messageText: {
    fontSize: 16,
  },
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  attachmentText: {
    color: "#6B7280",
    marginLeft: 4,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5A5D9D",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SpecificDM;
