import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import thriveHeader from "../components/thriveHeader";
import { query, collection, getDocs } from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";

const SearchResults: React.FC = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults]: any = useState([]);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = businesses.filter((item: any) =>
      item["businessName"].toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(filtered);
  };
  const displayBusinesses = () => {
    if (searchQuery.length === 0) {
      return null; // return null if search query is empty
    }

    return (
      <>
        {filteredResults.length > 0 ? (
          filteredResults.map((item: any, index: any) => (
            <TouchableOpacity key={index} style={styles.itemContainer}>
              <View
                style={[
                  styles.initialCircle,
                  {
                    backgroundColor: item.color
                      ? item.color
                      : ["#4338ca", "#38bdf8", "#059669", "#111827"][
                          Math.floor(Math.random() * 4)
                        ],
                  },
                ]}
              >
                <Text style={styles.initialText}>
                  {item.businessName.slice(0, 1)}
                </Text>
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemName}>{item.businessName}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <Feather name="arrow-right-circle" size={32} color="black" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No results found</Text>
        )}
      </>
    );
  };
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

          // Set the shuffled businesses to state
          setBusinesses(fetchedBusinesses);
        } else {
          console.error("No businesses found");
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };
    fetchBusinesses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {thriveHeader({})}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for businesses"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Feather
          name="search"
          size={24}
          color="#6B7280"
          style={styles.searchIcon}
        />
      </View>

      {/* Search Results */}
      <ScrollView style={styles.resultsList}>{displayBusinesses()}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4E8EE",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: "#1F2937",
  },
  searchIcon: {
    marginLeft: 8,
  },
  resultsList: {
    marginTop: 16,
    flex: 1,
    padding: 0,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginHorizontal: 5,
    marginTop: 10,
    borderRadius: 15,
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
  noResultsText: {
    textAlign: "center",
    color: "#0f172a",
    marginTop: 20,
    fontFamily: "Outfit-Medium",
    fontSize: 18,
  },
});

export default SearchResults;
