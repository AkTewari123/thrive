import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MessageProps {
  content: string;
  isUser: boolean;
  attachment?: string;
}

const Message: React.FC<MessageProps> = ({ content, isUser, attachment }) => (
  <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.otherMessage]}>
    <Text style={[
      styles.messageText,
      isUser ? styles.userMessageText : styles.otherMessageText
    ]}>
      {content}
    </Text>
    {attachment && (
      <View style={styles.attachmentContainer}>
        <Feather name="paperclip" size={16} color="#6B7280" />
        <Text style={styles.attachmentText}>{attachment}</Text>
      </View>
    )}
  </View>
);

const SpecificDM: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 0);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      scrollToBottom
    );

    // Scroll to bottom when component mounts
    scrollToBottom();

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [scrollToBottom]);

  return (
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
        <Message
          content="Hey, I saw your review. What food was the best?"
          isUser={true}
        />
        <Message
          content="Definitely the egg sushi. It was delicious!"
          isUser={false}
        />
        <Message
          content="Menu.pdf"
          isUser={false}
          attachment="Menu.pdf"
        />
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Message"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Feather name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageListContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerName: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    color: 'white',
    backgroundColor: '#5A5D9D',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  userMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'black',
  },
  messageText: {
    fontSize: 16,
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  attachmentText: {
    color: '#6B7280',
    marginLeft: 4,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
    backgroundColor: '#5A5D9D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpecificDM;