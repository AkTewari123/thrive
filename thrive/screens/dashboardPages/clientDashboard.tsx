import React, { useEffect, useState, useCallback } from "react";
import Feather from "@expo/vector-icons/Feather";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,  // Ensure Image is imported
  Button,  // Ensure Button is imported
} from "react-native";
import thriveHeader from "../components/thriveHeader";
import { FIRESTORE, FIREBASE_AUTH } from "../../FirebaseConfig"; // Ensure AUTH is imported for current user
import { collection, getDocs, query } from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { format } from 'date-fns'; // Ensure date formatting

interface BusinessItemProps {
  name: string;
  description: string;
  initial: string;
  email: string;
  id: string;
}

interface OrderItemProps {
  id: string;
  productName: string;
  productImage: string;
  productPrice: string;
  timestamp: any;
  userId: string;
  fulfilled: boolean;
}

const BusinessItem: React.FC<BusinessItemProps> = ({
  name,
  description,
  initial,
  email,
  id,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("SpecificBusinessPage", { id: id })}
    >
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
};

const fetchBusinessesAndOrders = async (userId: string) => {
  const businesses: any = [];
  const orders: any = [];
  try {
    const businessQuery = query(collection(FIRESTORE, "businessData"));
    const querySnapshot = await getDocs(businessQuery);

    if (!querySnapshot.empty) {
      for (const businessDoc of querySnapshot.docs) {
        const businessData = businessDoc.data();
        const rawOrders = businessData.orders || null;
        businesses.push(businessData);

        // Check if orders is an array within the business data
        if (Array.isArray(rawOrders)) {
          // Filter orders where fulfilled is false and userId matches
          const filteredOrders = rawOrders.filter(
            (order: any) => order.fulfilled === false && order.userId === userId
          );

          for (let o of filteredOrders) {
            orders.push(o);
          }
        }
      }
    } else {
      console.error("No businesses found");
    }
  } catch (error) {
    console.error("Error fetching businesses and orders:", error);
  }
  return { businesses, orders };
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const OrderItem: React.FC<OrderItemProps> = ({
  id,
  productName,
  productImage,
  productPrice,
  timestamp,
  userId,
  fulfilled,
}) => (
  <View style={styles.orderContainer}>
    <Text style={styles.orderTitle}>{productName}</Text>
    <Image source={{ uri: productImage }} style={styles.orderImage} />
    <Text style={styles.orderDescription}>Price: ${productPrice}</Text>
    <Text style={styles.orderDescription}>
      Timestamp: {format(timestamp.toDate(), "PPpp")}
    </Text>
  </View>
);

const SeeMoreButton: React.FC<{ func: () => void }> = ({ func }) => (
  <TouchableOpacity style={styles.seeMoreButton} onPress={func}>
    <Text style={styles.seeMoreText}>See More</Text>
    <Feather name="arrow-down-circle" size={18} color="white" />
  </TouchableOpacity>
);

const ClientDashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(2);
  const user = FIREBASE_AUTH.currentUser;

  useFocusEffect(
    useCallback(() => {
      const fetchBusinessesAndOrdersData = async () => {
        if (user) {
          setLoading(true);
          const { businesses, orders } = await fetchBusinessesAndOrders(user.email);
          setBusinesses(businesses);
          setOrders(orders);
          setLoading(false);
        }
      };

      fetchBusinessesAndOrdersData();
    }, [user])
  );

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
        email={business.email}
        id={business.businessID}
      />
    ));
  };

  const renderOrderItems = () => {
    return orders.map((order, idx) => (
      <OrderItem
        key={idx}
        id={order.id}
        productName={order.productName}
        productImage={order.productImage}
        productPrice={order.productPrice}
        timestamp={order.timestamp}
        userId={order.userId}
        fulfilled={order.fulfilled}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {thriveHeader({})}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Business Section */}
          <View style={[styles.section, { marginTop: 20 }]}>
            <SectionHeader title="Discover Businesses" />
            {loading ? (
              <ActivityIndicator size="large" color="#6B7280" />
            ) : (
              renderBusinessItems()
            )}
            <SeeMoreButton func={handleSeeMore} />
          </View>

          {/* Orders Section */}
          <View style={styles.section}>
            <SectionHeader title="Your Orders" />
            {loading ? (
              <ActivityIndicator size="large" color="#6B7280" />
            ) : orders.length > 0 ? (
              renderOrderItems()
            ) : (
              <Text>No unfulfilled orders found.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles same as provided
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
  orderContainer: {
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  orderImage: {
    width: 80,
    height: 80,
    marginVertical: 10,
    borderRadius: 8,
  },
  orderDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 3,
  },
});

export default ClientDashboard;
