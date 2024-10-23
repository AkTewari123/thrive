import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE, FIREBASE_AUTH } from "../../FirebaseConfig";
import thriveHeader from "../components/thriveHeader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

type RootStackParamList = {
  LandingPageBusiness: undefined;
  BusinessPage: { id: string }; // `id` parameter added
  EditBusinessPage: { id: string }; // `id` parameter added
  BusinessOrdersPage: { id: string }; // `id` parameter added
};

interface EditButtonProps {
  businessID: string;
}

interface EditButtonProps {
  businessID: string;
}

const EditButtons: React.FC<EditButtonProps> = ({ businessID }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleEditPress = () => {
    navigation.navigate("EditBusinessPage", { id: businessID });
  };

  const handlePreviewPress = () => {
    // Assuming you have a preview page or can create a navigation route for preview
    navigation.navigate("BusinessPage", { id: businessID });
  };

  return (
    <View style={styles.editButtonsContainer}>
      <Pressable style={styles.editButton} onPress={handleEditPress}>
        <Feather name="edit-2" size={20} color="#618BDB" />
        <Text style={styles.editButtonText}>Edit Page</Text>
      </Pressable>
      <Pressable style={styles.previewButton} onPress={handlePreviewPress}>
        <FontAwesome name="eye" size={20} color="#618BDB" />
        <Text style={styles.previewButtonText}>Preview Page</Text>
      </Pressable>
    </View>
  );
};

interface RatingStarProps {
  stars: number;
}

export const RatingStars: React.FC<RatingStarProps> = ({ stars }) => (
  <View style={styles.ratingContainer}>
    {Array.from({ length: 5 }, (_, index) => (
      <FontAwesome
        key={index}
        name={index < stars ? "star" : "star-o"}
        size={16}
        color="#FFD700"
      />
    ))}
    <Text style={styles.ratingText}>{stars.toFixed(1)}</Text>
  </View>
);

interface CompanyProps {
  name: string;
  rating: number;
  initial: string;
}

const CompanyHeader: React.FC<CompanyProps> = ({ name, rating, initial }) => (
  <View style={styles.companyHeader}>
    <View style={styles.profileCircle}>
      <Text style={styles.initialText}>{initial}</Text>
    </View>
    <View style={styles.headerTextContainer}>
      <Text style={styles.companyHeaderNameText}>{name}</Text>
      <RatingStars stars={rating} />
    </View>
  </View>
);

interface OrderProps {
  orders: number;
  businessID: any;
}

const OrdersBox: React.FC<OrderProps> = ({ orders, businessID }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.ordersBoxContainer}>
      <View style={styles.ordersInfo}>
        <Text style={styles.ordersNumberText}>{orders}</Text>
        <Text style={styles.ordersText}>
          {orders === 1 ? "New Order" : "New Orders"}
        </Text>
      </View>
      <Pressable
        style={styles.fulfillOrdersButton}
        onPress={() =>
          navigation.navigate("BusinessOrdersPage", { id: businessID })
        }
      >
        <Text style={styles.fulfillOrdersText}>Fulfill Orders</Text>
      </Pressable>
    </View>
  );
};

const AIInsights: React.FC = () => (
  <View style={styles.insightContainer}>
    <Text style={styles.insightTitle}>
      Insights &nbsp;
      <Feather name="help-circle" size={20} color="#0f172a" />
    </Text>
    <View style={{ marginTop: 0 }}>
      <Text style={[styles.insightSubtitle]}>Quick Tips:</Text>
    </View>

    <View style={styles.insightItem}>
      <Text style={styles.insightNumber}>1.</Text>
      <Text style={styles.insightText}>
        Lower the price of Gobhi Manchurian from $5 to $4 to entice more
        customers.
      </Text>
    </View>
    <View style={styles.insightItem}>
      <Text style={styles.insightNumber}>2.</Text>
      <Text style={styles.insightText}>
        Correct the menu spelling from "paner" to "paneer".
      </Text>
    </View>
    <Text style={styles.insightSubtitle}>Competing businesses:</Text>
    <View style={styles.insightItem}>
      <Text style={styles.insightNumber}>1.</Text>
      <Text style={styles.insightText}>
        Akbar's Kitchen &nbsp;
        <Feather name="external-link" size={14} color="#618BDB" />
      </Text>
    </View>
  </View>
);

interface BusinessData {
  businessName: string;
  location: string;
  establishmentDate: string;
  services: string;
  phoneNumber: string;
  businessID: string;
  orders: Array<any>;
}

const LandingPageBusiness: React.FC = () => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchBusinessData = async () => {
        try {
          const user = FIREBASE_AUTH.currentUser;
          if (user) {
            const docRef = doc(FIRESTORE, "businessData", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setBusinessData(docSnap.data() as BusinessData);
            }
          }
        } catch (error) {
          console.error("Error fetching business data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBusinessData();
    }, []) // Empty dependency array ensures it runs only when the screen is focused
  );
  console.log(businessData);

  const orders = businessData?.orders || [];
  const numNewOrders = orders.filter(
    (order) => order.fulfilled === false
  ).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {thriveHeader({})}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A5D9D" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {thriveHeader({})}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CompanyHeader
          name={businessData?.businessName || "Business Name"}
          rating={4}
          initial={businessData?.businessName?.[0] || "B"}
        />
        <View style={[styles.contentContainer]}>
          <EditButtons businessID={businessData?.businessID || ""} />
          <OrdersBox
            orders={numNewOrders}
            businessID={businessData?.businessID}
          />
          <View style={styles.businessInfoContainer}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 15,
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="compass" size={30} color="#0f172a" />
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Outfit-Medium",
                    }}
                  >
                    {"\n"}
                    {"\n"}

                    {businessData?.location
                      ? businessData?.location
                      : "903 Illonois Ave."}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 15,
                }}
              >
                <View>
                  <Text style={{ textAlign: "center" }}>
                    <Feather name="phone-call" size={30} color="#0f172a" />
                  </Text>
                  <View>
                    <Text
                      style={{
                        fontSize: 8,
                        fontFamily: "Outfit-Medium",
                      }}
                    >
                      {"\n"}
                      {businessData?.phoneNumber
                        ? businessData?.phoneNumber
                        : "732-453-8908"}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 15,
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="calendar" size={30} color="#0f172a" />
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Outfit-Medium",
                    }}
                  >
                    {"\n"}
                    {"\n"}
                    {businessData?.establishmentDate
                      ? businessData?.establishmentDate
                      : "09/23/1954"}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 15,
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="credit-card" size={30} color="#0f172a" />
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Outfit-Medium",
                    }}
                  >
                    {"\n"}

                    {businessData?.businessID
                      ? businessData?.businessID
                      : "123894u70=4jkdfnleqjl032"}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <AIInsights />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 16,
  },
  editButtonText: {
    color: "#618BDB",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5A5D9D",
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 20,
  },
  profileCircle: {
    backgroundColor: "#FFFFFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    color: "#5A5D9D",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTextContainer: {
    marginLeft: 16,
  },
  companyHeaderNameText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#FFFFFF",
    marginLeft: 4,
    fontSize: 14,
  },
  ordersBoxContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ordersInfo: {
    flexDirection: "column",
  },
  ordersNumberText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#5A5D9D",
  },
  ordersText: {
    fontSize: 14,
    color: "#4B5563",
  },
  fulfillOrdersButton: {
    backgroundColor: "#5A5D9D",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  fulfillOrdersText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  insightContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F2937",
    textAlign: "center",
    fontFamily: "Outfit-Semibold",
  },
  insightSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0f172a",
    fontFamily: "Outfit-Semibold",
  },
  insightItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  insightNumber: {
    fontWeight: "bold",
    marginRight: 8,
    color: "#5A5D9D",
  },
  insightText: {
    fontSize: 14,
    color: "#4B5563",
    fontFamily: "Outfit-Medium",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  businessInfoContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1F2937",
    textAlign: "center",
    fontFamily: "Outfit-Bold",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#4B5563",
  },
  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8, // Add margin to separate the buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewButtonText: {
    color: "#618BDB",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  childContainer: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: 25,
    flexShrink: 1,
  },
});

export default LandingPageBusiness;
