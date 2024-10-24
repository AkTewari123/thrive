import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
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
import { set } from "date-fns";

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
  businessID: string;
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
  const { businessID } = route.params as RouteParams;

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "View Posts",
      headerBackTitle: "Back",
    });
  }, [navigation]);

  // Fetch user by businessID and then their posts
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        // Query the users collection for the user with the given businessID
        const userQuery = query(
          collection(FIRESTORE, 'users'),
          where('userType', '==', 'Business')
        );

        const userSnapshot = await getDocs(userQuery);

        let foundUserEmail: string | null = null;

        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.businessID === businessID) {
            foundUserEmail = userData.email;
          }
        });

        if (!foundUserEmail) {
          throw new Error('No user found with the given businessID');
        }

        setUserEmail(foundUserEmail);

        // Query the posts collection for posts related to the found user's email
        const postQuery = query(
          collection(FIRESTORE, 'posts'),
          where('companyEmail', '==', foundUserEmail),
          orderBy('timestamp', 'desc')
        );

        const postSnapshot = await getDocs(postQuery);

        const postsData: Post[] = [];
        postSnapshot.forEach((doc) => {
          postsData.push({
            id: doc.id,
            ...doc.data(),
          } as Post);
        });

        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [businessID]);

  
  
  

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#5A5D9D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
