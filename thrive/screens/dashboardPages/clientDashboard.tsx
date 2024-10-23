import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import thriveHeader from "../components/thriveHeader";
import * as SplashScreen from "expo-splash-screen";
import { FIRESTORE } from "../../FirebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface BusinessItemProps {
  name: string;
  description: string;
  initial: string;
}

const BusinessItem: React.FC<BusinessItemProps> = ({
  name,
  description,
  initial,
}) => (
  <TouchableOpacity style={styles.itemContainer}>
    <View
      style={[
        styles.initialCircle,
        { backgroundColor: initial === "H" ? "#8B5CF6" : "#22C55E" },
      ]}
    >
      <Text style={styles.initialText}>{initial}</Text>
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
    </View>
    <Feather name="arrow-right-circle" size={24} color="#6B7280" />
  </TouchableOpacity>
);

interface SectionHeaderProps {
  title: string;
}

const fetchBusinesses = async () => {
  const businesses: any = [];
  try {
    const businessQuery = query(collection(FIRESTORE, "businessData"));
    const querySnapshot = await getDocs(businessQuery);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((businessDoc: any) => {
        const businessData = businessDoc.data();
        businesses.push(businessData);
      });
    } else {
      console.error("No businesses found");
    }
  } catch (error) {
    console.error("Error fetching businesses:", error);
  }
  return businesses.length ? businesses : null;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

interface SeeMoreProps {
  func: () => void;
}

const SeeMoreButton: React.FC<SeeMoreProps> = ({ func }) => (
  <TouchableOpacity style={styles.seeMoreButton} onPress={func}>
    <Text style={styles.seeMoreText}>See More</Text>
    <Feather name="arrow-down-circle" size={18} color="white" />
  </TouchableOpacity>
);

interface FollowingItemProps {
  name: string;
  description: string;
  email: string;
}

const Following: React.FC<FollowingItemProps> = ({
  name,
  description,
  email,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("CompanyPostHistory", {
          companyEmail: email,
          companyName: name,
        });
      }}
    >
      <View style={[styles.initialCircle, { backgroundColor: "#F472B6" }]}>
        <Text style={styles.initialText}>{name.slice(0, 1)}</Text>
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Feather name="arrow-right-circle" size={24} color="#6B7280" />
    </TouchableOpacity>
  );
};

const ClientDashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(2);

  useEffect(() => {
    const fetchBusinessesData = async () => {
      setLoading(true);
      const fetchedBusinesses = await fetchBusinesses();
      if (fetchedBusinesses) setBusinesses(fetchedBusinesses);
      setLoading(false);
    };

    fetchBusinessesData();
  }, []);

  const handleSeeMore = () => {
    setVisibleItems((prev) => prev + 2);
  };

  const renderBusinessItems = () => {
    return businesses.slice(0, visibleItems).map((business, idx) => (
      <BusinessItem
        key={idx}
        name={business.businessName}
        description={business.description}
        initial={business.businessName[0]}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {thriveHeader({})}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <SectionHeader title="Following" />
            <Following
              name="Hyderabad Spice"
              description="New Spicy Kurma Dish!"
              email="hyderabadspice@example.com"
            />
            <Following
              name="Ganga"
              description="Best Curry in Town!"
              email="ganga@example.com"
            />
            <SeeMoreButton func={handleSeeMore} />
          </View>

          <View style={[styles.section, { marginTop: 20 }]}>
            <SectionHeader title="Recommended" />
            {loading ? (
              <ActivityIndicator size="large" color="#6B7280" />
            ) : (
              renderBusinessItems()
            )}
            <SeeMoreButton func={handleSeeMore} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
  },
  initialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4F46E5",
  },
  initialText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  itemDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 3,
  },
  seeMoreButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5A5D9D",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  seeMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
});

export default ClientDashboard;
