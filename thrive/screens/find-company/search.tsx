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
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import DropDownPicker from 'react-native-dropdown-picker';

const SearchResults: React.FC = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredResults, setFilteredResults]: any = useState([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    const filtered = businesses.filter((item: any) => {
      const businessName = item["businessName"] || "";  // Default to empty string if undefined
      const matchesQuery = businessName.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory ? item["category"] === selectedCategory : true;
      return matchesQuery && matchesCategory;
    });
    setFilteredResults(filtered);
  };
  
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  
    const filtered = businesses.filter((item: any) => {
      const businessName = item["businessName"] || "";  // Default to empty string if undefined
      const matchesQuery = businessName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category ? item["category"] === category : true;
      return matchesQuery && matchesCategory;
    });
    setFilteredResults(filtered);
  };
  

  const navigation = useNavigation<StackNavigationProp<any>>();

  const displayBusinesses = () => {
    if (searchQuery.length === 0 && !selectedCategory) {
      return (
        <View style={styles.emptyStateContainer}>
          <Feather name="search" size={64} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>Search for a business</Text>
          <Text style={styles.emptyStateSubText}>
            Find a business by name or category
          </Text>
        </View>
      );
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
                <Pressable
                  onPress={() =>
                    navigation.navigate("SpecificBusinessPage", {
                      id: item.businessID,
                    })
                  }
                >
                  <Text style={styles.itemName}>{item.businessName}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </Pressable>
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
        const businessQuery = query(collection(FIRESTORE, "businessData"));
        const querySnapshot = await getDocs(businessQuery);

        if (!querySnapshot.empty) {
          const fetchedBusinesses: any = [];
          querySnapshot.forEach((businessDoc: any) => {
            const businessData = businessDoc.data();
            fetchedBusinesses.push(businessData);
          });

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

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'All', value: null },
    { label: 'Food', value: 'food' },
    { label: 'Service', value: 'service' },
    { label: 'Arts and Crafts', value: 'arts_crafts' },
    { label: 'Technology', value: 'technology' },
    { label: 'Retail', value: 'retail' },
  ]);

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

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={selectedCategory}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedCategory}
          setItems={setItems}
          placeholder="Select a Category"
          onChangeValue={handleCategorySelect}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainerStyle}
        />
      </View>

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
    padding: 5,
    marginHorizontal: 10,
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
    marginTop: 5,
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
    fontSize: 18,
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
  dropdownContainer: {
    margin: 10,
    height:50,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#E5E7EB",
  },
  dropdownContainerStyle: {
    backgroundColor: "white",
    borderColor: "#E5E7EB",
    maxHeight: 150,
  },
});

export default SearchResults;
