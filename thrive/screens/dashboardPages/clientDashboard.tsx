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
import { useFonts } from "expo-font";
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
    <Text style={styles.arrowRight}>
      <Feather name="arrow-right-circle" size={32} color="black" />
    </Text>
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
      querySnapshot.forEach(async (businessDoc: any) => {
        const businessData = businessDoc.data();
        businesses.push(businessData);
      });
    } else {
      console.error("User not found");
    }
  } catch (error) {
    console.error("Error updating user color:", error);
  }
  if (businesses.length === 0) {
    console.error("No Businesses found, check api");
    return null;
  }
  return businesses;
};
fetchBusinesses();

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);
interface seeMore {
  businesses?: any[];
}
const SeeMoreButton: React.FC<seeMore> = ({ businesses }) => (
  <TouchableOpacity
    style={styles.seeMoreButton}
    onPress={() => {
      console.log(businesses);
      businesses?.map((business: any, idx: number) =>
        idx > 2 ? (
          <Reccommended
            key={business["id"] || idx}
            name={business["businessName"]}
            color={
              business["color"] != null
                ? business["color"]
                : ["#14b8a6", "#4f46e5", "#047857", "#881337"][
                    Math.floor(Math.random() * 4)
                  ]
            }
            description={business["description"] || "Business Near You"}
            email="myBusiness@gmail.com"
          />
        ) : null
      );
    }}
  >
    <Text style={styles.seeMoreText}>See More</Text>
    <Feather name="arrow-down-circle" size={32} color="#3B82F6" />
  </TouchableOpacity>
);

interface followingItemProps {
  name: string;
  description: string;
  color: string;
  email: string;
}

const Following: React.FC<followingItemProps> = ({
  name,
  description,
  color,
  email,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("CompanyPostHistory", {companyEmail: email, companyName: name,});
      }}
    >
      <View style={[styles.initialCircle, { backgroundColor: color }]}>
        <Text style={styles.initialText}>{name.slice(0, 1)}</Text>
      </View>
      <View style={styles.notificationPing}></View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Text style={styles.arrowRight}>
        <Feather name="arrow-right-circle" size={32} color="black" />
      </Text>
    </TouchableOpacity>
  );
};

interface reccommendedItemProps {
  name: string;
  description: string;
  color: string;
  email: string;
}
const Reccommended: React.FC<reccommendedItemProps> = ({
  name,
  description,
  color,
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
      <View style={[styles.initialCircle, { backgroundColor: color }]}>
        <Text style={styles.initialText}>{name.slice(0, 1)}</Text>
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Text style={styles.arrowRight}>
        <Feather name="arrow-right-circle" size={32} color="black" />
      </Text>
    </TouchableOpacity>
  );
};

const ClientDashboard: React.FC = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Outfit-Medium": require("../../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Bold": require("../../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-SemiBold": require("../../assets/fonts/Outfit-SemiBold.ttf"),
  });
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // Fetch businesses
        const businessQuery = query(collection(FIRESTORE, "businessData"));
        const querySnapshot = await getDocs(businessQuery);

        // Check if any businesses were found
        if (!querySnapshot.empty) {
          const fetchedBusinesses: any = [];
          querySnapshot.forEach((businessDoc: any) => {
            const businessData = businessDoc.data();
            fetchedBusinesses.push(businessData);
          });

          // Shuffle businesses after fetching
          function shuffle(array: any) {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          }

          // Set the shuffled businesses to state
          setBusinesses(shuffle(fetchedBusinesses));
        } else {
          console.error("No businesses found");
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();

    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {thriveHeader({})}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <SectionHeader title="Following" />
          <Following
            name="Hyderbad Spice"
            color="#2196F3"
            description="New Spicy Kurma Dish!"
            email="hyderabadspice@example.com"
          />
          <Following
            name="Ganga"
            color="rgb(20 184 166)"
            description="New Spicy Kurma Dish!"
            email="ganga@example.com"
          />
          <SeeMoreButton />
          <SectionHeader title="Recommended" />
          {loading ? ( // Show loading indicator if loading
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            businesses.map((business, idx) =>
              idx < 2 ? (
                <Reccommended
                  key={business["id"] || idx}
                  name={business["businessName"]}
                  color={
                    business["color"] != null
                      ? business["color"]
                      : ["#14b8a6", "#4f46e5", "#047857", "#881337"][
                          Math.floor(Math.random() * 3)
                        ]
                  }
                  description={business["description"] || "Business Near You"}
                  email="myBusiness@gmail.com"
                />
              ) : null
            )
          )}
          {/* {followingElements()} */}
          <SeeMoreButton businesses={businesses} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E4E8EE",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 10,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#E4E8EE",
    padding: 10,
  },
  sectionHeader: {
    fontSize: 35,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 24,
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    borderTopColor: "#DDDDDD",
    borderTopWidth: 1,
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    color: "white",
    fontSize: 18,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    color: "#1F2937",
  },
  itemDescription: {
    fontSize: 14,
    color: "#618BDB",
    fontWeight: "600",
  },
  arrowRight: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  seeMoreButton: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
    padding: 2,
  },
  seeMoreText: {
    color: "#3B82F6",
    fontSize: 16,
  },
  notificationPing: {
    backgroundColor: "#EE4957",
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    top: 17,
    left: 45,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E4E8EE',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerText: {
//     marginLeft: 8,
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   content: {
//     flex: 1,
//   },
//   sectionHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginTop: 24,
//     marginBottom: 8,
//     marginLeft: 16,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   initialCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   initialText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   itemTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   itemDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   arrowRight: {
//     fontSize: 20,
//     color: '#9CA3AF',
//   },
//   seeMoreButton: {
//     backgroundColor: 'white',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//     alignItems: 'center',
//     padding: 2,
//   },
//   seeMoreText: {
//     color: '#3B82F6',
//     fontSize: 16,
//   },
//   startChatButton: {
//     backgroundColor: '#5A5D9D',
//     margin: 16,
//     padding: 16,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     justifyContent: 'center',
//   },
//   startChatButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

export default ClientDashboard;
