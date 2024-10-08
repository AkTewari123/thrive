import React, { useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import thriveHeader from "../components/thriveHeader";
interface BusinessItemProps {
  name: string;
  description: string;
  initial: string;
}
import * as Font from "expo-font";
const loadFonts = async () => {
  await Font.loadAsync({
    "Outfit-Medium": require("../../assets/fonts/Outfit-Medium.ttf"), // Make sure the path is correct
  });
};
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

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const SeeMoreButton: React.FC = () => (
  <TouchableOpacity style={styles.seeMoreButton}>
    <Text style={styles.seeMoreText}>See More</Text>
    <Feather name="arrow-down-circle" size={32} color="#3B82F6" />
  </TouchableOpacity>
);

interface followingItemProps {
  name: string;
  description: string;
  color: string;
}

const Following: React.FC<followingItemProps> = ({
  name,
  description,
  color,
}) => (
  <TouchableOpacity style={styles.itemContainer}>
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
interface reccommendedItemProps {
  name: string;
  description: string;
  color: string;
}

const Reccommended: React.FC<reccommendedItemProps> = ({
  name,
  description,
  color,
}) => (
  <TouchableOpacity style={styles.itemContainer}>
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

const ClientDashboard: React.FC = () => {
  return (
    <>
      {thriveHeader({})}
      <Text style={{ fontFamily: "Outfit-Bold" }}>Hello World!</Text>
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          <SectionHeader title="Following"></SectionHeader>
          <Following
            name="Hyderbad Spice"
            color="#2196F3"
            description="New Spicy Kurma Dish!"
          />
          <Following
            name="Ganga"
            color="rgb(20 184 166)"
            description="New Spicy Kurma Dish!"
          />
          <SectionHeader title="Recommended"></SectionHeader>
          <Reccommended
            name="Livito's"
            color="#F69D61"
            description="Italian Cuisine since 1994"
          />
          <Reccommended
            name="Pine Tavern"
            color="#F6E061"
            description="World's Best Burgers"
          />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4E8EE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
  headerText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 24,
    backgroundColor: "white",
    paddingLeft: 16,
    paddingVertical: 10,
    fontFamily: "Outfit-Medium",
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
    fontFamily: "Outfit-Bold",
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
    fontWeight: "bold",
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
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
  startChatButton: {
    backgroundColor: "#5A5D9D",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  startChatButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
