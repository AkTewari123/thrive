import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  query,
  getDocs,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";

interface Post {
  id?: string;
  title: string;
  content: string;
  companyName: string;
  companyEmail: string;
  timestamp: Timestamp;
  color: string;
}

interface RouteParams {
  companyEmail: string;
  companyName: string;
}

const PostItem: React.FC<Post> = ({
  title,
  content,
  companyName,
  timestamp,
  color,
}) => (
  <View style={styles.postContainer}>
    <View style={[styles.companyCircle, { backgroundColor: color }]}>
      <Text style={styles.companyInitial}>
        {companyName.charAt(0).toUpperCase()}
      </Text>
    </View>
    <View style={styles.postContent}>
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postText}>{content}</Text>
      <View style={styles.postMeta}>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.timestamp}>
          {timestamp.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  </View>
);

export const CompanyPostHistory: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { companyEmail, companyName } = route.params as RouteParams;

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchCompanyPosts();
  }, [companyEmail]);

  const fetchCompanyPosts = async () => {
    if (!companyEmail) return;

    try {
      const q = query(
        collection(FIRESTORE, "posts"),
        where("companyName", "==", companyName),
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#5A5D9D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{companyName}'s Updates</Text>
      </View>

      <ScrollView style={styles.content}>
        {posts.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No updates yet</Text>
            <Text style={styles.emptyStateSubText}>
              This company hasn't posted any updates
            </Text>
          </View>
        ) : (
          posts.map((post) => <PostItem key={post.id} {...post} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4E8EE",
  },
  header: {
    backgroundColor: "#5A5D9D",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Offset for back button to center title
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    marginBottom: 8,
    color: "#1F2937",
  },
  postText: {
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 12,
    lineHeight: 24,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 8,
  },
  companyName: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
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

export default CompanyPostHistory;
