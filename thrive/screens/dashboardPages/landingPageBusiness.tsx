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
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from "react-native-ui-lib";
import axios from 'axios';
import { OPENAI_API_KEY } from "../../apiKeys";

type RootStackParamList = {
  LandingPageBusiness: undefined;
  BusinessPage: { id: string }; // `id` parameter added
  EditBusinessPage: { id: string }; // `id` parameter added
  BusinessOrdersPage: { id: string }; // `id` parameter added
};

interface EditButtonProps {
  businessID: string;
}

const EditButtons: React.FC<EditButtonProps> = ({ businessID }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleEditPress = () => {
    navigation.navigate("EditBusinessPage", { id: businessID });
  };

  const handlePreviewPress = () => {
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
  landing: boolean
}

export const CompanyHeader: React.FC<CompanyProps> = ({ name, rating, initial, landing }) => {
  let marginHoriz = landing ? 15 : 0;
  return (
  <View style={[styles.companyHeader, {marginHorizontal: marginHoriz}]}>
    <View style={styles.profileCircle}>
      <Text style={styles.initialText}>{initial}</Text>
    </View>
    <View style={styles.headerTextContainer}>
      <Text style={styles.companyHeaderNameText}>{name}</Text>
      <RatingStars stars={rating} />
    </View>
  </View>
  );
};

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

interface BusinessInfoProps {
  location: string;
  phoneNumber: string;
  establishmentDate: string;
  businessID: string;
}

const BusinessInfoSection: React.FC<BusinessInfoProps> = ({
  location,
  phoneNumber,
  establishmentDate,
  businessID,
}) => {
  const infoCards = [
    {
      icon: "compass",
      label: "Location",
      value: location,
      color: "#4A90E2"
    },
    {
      icon: "phone-call",
      label: "Contact",
      value: phoneNumber,
      color: "#50C878"
    },
    {
      icon: "calendar",
      label: "Established",
      value: establishmentDate,
      color: "#FFB347"
    },
    {
      icon: "credit-card",
      label: "Business ID",
      value: businessID,
      color: "#FF6B6B"
    }
  ];

  return (
    <View style={styles.businessInfoContainer}>
      <Text style={styles.sectionTitle}>Business Information</Text>
      <View style={styles.cardsContainer}>
        {infoCards.map((card, index) => (
          <View key={index} style={styles.infoCard}>
            <View style={[styles.iconContainer, { backgroundColor: card.color + '15' }]}>
              <Feather name={card.icon} size={24} color={card.color} />
            </View>
            <Text style={styles.cardLabel}>{card.label}</Text>
            <Text style={styles.cardValue} numberOfLines={2}>{card.value || 'Not provided'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

interface BusinessInfoProps {
  location: string;
  phoneNumber: string;
  establishmentDate: string;
  businessID: string;
}

const AIInsights: React.FC = () => {
    
    const [insights, setInsights] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [businessData, setBusinessData] = useState<any>(null); // Update type as necessary

    const fetchBusinessData = async () => {
        try {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const docRef = doc(FIRESTORE, 'businessData', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBusinessData(docSnap.data());
                } else {
                    console.error("No such document!");
                }
            }
        } catch (error) {
            console.error("Error fetching business data:", error);
        }
    };

    
    

    // Function to fetch AI insights
    const fetchAIInsights = async () => {
        if (!businessData) return; // Do not fetch insights if business data is not available

        setIsLoading(true);
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',  // Or the latest model available
                    messages: [
                        { 
                            role: 'system', 
                            content: `Tell me how to improve the content of my profile for my buisness. Make each suggestion a maximum of one sentence each (max 3 suggestions with 10 words max per each suggestion). Examples include: 'Add x', 'Fix spelling of buisness to business', 'add more description to y'. If a field is undefined, say add an (whatever)
                            Suggestions should look at quality of descriptions, and things such as grammar in what is displayed, and then show the solution. Start each bullet with text (no hyphen). Here is what is displayed:
                            
                                
                            
                                ${businessData.businessName}
                                ${businessData.services}
                                ${businessData.location}
                                ${businessData.phoneNumber}
                                ` 
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0,

                },
                {
                    headers: {
                        Authorization: `Bearer ${OPENAI_API_KEY}`,  //use env but if not just change the api key but make sure not to push it 
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Extract insights from the OpenAI response
            const aiResponse = response.data.choices[0].message.content.split("\n");
            setInsights(aiResponse); // Save the insights to state

        } catch (error) {
            console.error('Error fetching AI insights:', error);
        }
        setIsLoading(false);
    };

    // Fetch business data and then fetch AI insights when the component mounts
    React.useEffect(() => {
        fetchBusinessData();
    }, []);

    // Fetch AI insights whenever business data changes
    React.useEffect(() => {
        if (businessData) {
            fetchAIInsights();
        }
    }, [businessData]);

    return(
  <View style={styles.insightContainer}>
    <Text style={styles.insightTitle}>
      Insights &nbsp;
      <Feather name="help-circle" size={20} color="#0f172a" />
    </Text>
    <View style={{ marginTop: 0 }}>
      <Text style={[styles.insightSubtitle]}>Quick Tips:</Text>
      {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                insights.map((insight, index) => (
                    <View style={styles.insightItem} key={index}>
                        <Text style={styles.insightNumber}>{index + 1}.</Text>
                        <Text style={styles.insightText}>{insight}</Text>
                    </View>
                ))
            )}
    <Text style={styles.insightSubtitle}>Competing businesses:</Text>
        <View style={styles.insightItem}>
        <Text style={styles.insightNumber}>1.</Text>
        <Text style={styles.insightText}>
            Akbar's Kitchen &nbsp;
            <Feather name="external-link" size={14} color="#618BDB" />
        </Text>
        </View>
   </View>
  </View>

    );
};

interface BusinessData {
  businessName: string;
  location: string;
  establishmentDate: string;
  services: string;
  phoneNumber: string;
  businessID: string;
  orders: Array<any>;
  reviews: Array<any>;
}

const LandingPageBusiness: React.FC = () => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleGraphsPress = () => {
    navigation.navigate('Graphs');
  }

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
    }, [])
  );

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

  let sum = 0;
	for (let i = 0; i < businessData?.reviews.length; i++) {
		sum += businessData?.reviews[i].rating;
	}

  return (
    <SafeAreaView style={styles.container}>
      {thriveHeader({})}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CompanyHeader
          name={businessData?.businessName || "Business Name"}
          rating={businessData?.reviews.length > 0 ? sum / businessData?.reviews.length : 0}
          initial={businessData?.businessName?.[0] || "B"}
          landing={true}
        />
        <View style={[styles.contentContainer]}>
          <EditButtons businessID={businessData?.businessID || ""} />
          <OrdersBox
            orders={numNewOrders}
            businessID={businessData?.businessID}
          />
          <BusinessInfoSection
            location={businessData?.location || "903 Illinois Ave."}
            phoneNumber={businessData?.phoneNumber || "732-453-8908"}
            establishmentDate={businessData?.establishmentDate || "09/23/1954"}
            businessID={businessData?.businessID || "123894u70=4jkdfnleqjl032"}
          />
          <AIInsights />
        </View>
        <Button
          label="View Graphs"
          style={{ margin: 20, backgroundColor: "#5A5D9D", marginBottom: 45 }}
          onPress={handleGraphsPress}
        />
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
    padding: 25,
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
  },
  insightSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0f172a",
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
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  businessInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  }, cardValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'left',
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
    marginRight: 8,
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