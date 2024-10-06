import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import thriveHeader from "../components/thriveHeader";
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
  businessName: string;
  profileColor: string;
  initial: string;
}

const ClientDashboard: React.FC = () => {
  return (
    <>
      {thriveHeader({})}
      <Text>Hello World!</Text>
      <SectionHeader title="Following"></SectionHeader>
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
    marginBottom: 8,
    marginLeft: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    color: "#6B7280",
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
