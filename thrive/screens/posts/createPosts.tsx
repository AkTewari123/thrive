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
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  getDocs,
  addDoc,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";

// Types for our navigation
type RootStackParamList = {
  PostsList: undefined;
  PostDetail: { postId: string };
};

// Post type definition
interface Post {
  id?: string;
  title: string;
  content: string;
  companyName: string;
  companyEmail: string;
  timestamp: Timestamp;
  color: string;
}

// Component for individual post items
interface PostItemProps {
  title: string;
  content: string;
  companyName: string;
  timestamp: Timestamp;
  color: string;
  onPress: () => void;
}

const PostItem: React.FC<PostItemProps> = ({
  title,
  content,
  companyName,
  timestamp,
  color,
  onPress,
}) => (
  <TouchableOpacity style={styles.postContainer} onPress={onPress}>
    <View style={[styles.companyCircle, { backgroundColor: color }]}>
      <Text style={styles.companyInitial}>
        {companyName.charAt(0).toUpperCase()}
      </Text>
    </View>
    <View style={styles.postContent}>
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postPreview} numberOfLines={2}>
        {content}
      </Text>
      <View style={styles.postMeta}>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.timestamp}>
          {timestamp.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Company view for creating and managing posts
export const CompanyPosts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchCompanyPosts();
  }, [user?.email]);

  const fetchCompanyPosts = async () => {
    if (!user?.email) return;

    try {
      const q = query(
        collection(FIRESTORE, "posts"),
        where("companyEmail", "==", user.email),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const postsData: Post[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user?.email || !newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        companyName: user.email.split("@")[0],
        companyEmail: user.email,
        timestamp: Timestamp.now(),
        color: "#5A5D9D",
      };

      await addDoc(collection(FIRESTORE, "posts"), postData);
      setModalVisible(false);
      setNewPost({ title: "", content: "" });
      fetchCompanyPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {posts.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Feather name="file-text" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubText}>
              Create your first post to start sharing updates
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post.id}
              title={post.title}
              content={post.content}
              companyName={post.companyName}
              timestamp={post.timestamp}
              color={post.color}
              onPress={() => {}}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="white" />
        <Text style={styles.fabText}>New Post</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Post Title"
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="Post Content"
              value={newPost.content}
              onChangeText={(text) => setNewPost({ ...newPost, content: text })}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreatePost}
            >
              <Text style={styles.createButtonText}>Create Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
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
  postContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  companyCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  companyInitial: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  postContent: {
    flex: 1,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1F2937",
  },
  postPreview: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyName: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
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
  fabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F2937",
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: "#5A5D9D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
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
    paddingHorizontal: 40,
  },
});

export default {
  CompanyPosts,
};