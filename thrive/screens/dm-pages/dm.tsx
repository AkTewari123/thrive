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
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";

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
  const docRef = doc(FIRESTORE, "messages", "henry&Ak");
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Array<{ [key: string]: string }>>(
    []
  );
  const [text, setText] = useState("");
  const yourTexts = useRef(0);
  const rendered = useRef("false");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const chatData = docSnap.data().chat || []; // Retrieve chat data as an array of maps
          setMessages(chatData); // Set the messages state with the data
          console.log(messages);
          console.log("messages");
          scrollToBottom(); // Scroll to bottom after fetching messages
          for (var i = 0; i < messages.length; i++) {
            if (
              Object.keys(messages)[i].includes("ak") &&
              rendered.current == "false"
            ) {
              yourTexts.current++;
            }
          }
          rendered.current = "true";
          console.log(`Your texts: ${yourTexts.current}`);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
    scrollToBottom(); // Scroll when component mounts

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [scrollToBottom]);

  const handleSend = async (text: string) => {
    if (text.trim()) {
      text = text.trim();

      const newMessage = { [`ak${Math.floor(Math.random() * 100000)}`]: text }; // Construct the new message
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update local state
      setText(""); // Clear the input field
      try {
        // Update Firestore document with the new message (appending it to the existing chat array)
        await updateDoc(docRef, {
          chat: [...messages, newMessage], // Append the new message to the existing chat array
        });
        scrollToBottom(); // Scroll to the bottom after sending the message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const renderMessages = useMemo(() => {
    return messages.map((messageMap, index) => {
      const [sender, message] = Object.entries(messageMap)[0];
      const isUser = sender.includes("ak"); // Check if it's the user
      let hasAttachment = message.includes("attachment908(");
      return !hasAttachment ? (
        <Message key={sender} content={message} isUser={isUser} />
      ) : (
        <Message key={sender} isUser={isUser} attachment="Menu.pdf" />
      );
    });
  }, [messages]); // Memoize when `messages` array changes

  return (
    <>
    <SafeAreaView>
      </SafeAreaView>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerProfile}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <Text style={styles.headerName}>Henry Bagdasarov</Text>
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
    backgroundColor: "#8B5CF6",
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
