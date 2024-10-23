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
import { Modal } from "react-native";

const categories = ["food", "service", "arts_crafts", "technology", "retail"];
import { FlatList } from "react-native";

const SearchResults: React.FC = () => {
	const [businesses, setBusinesses] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);
	const [filteredResults, setFilteredResults]: any = useState([]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);

		const filtered = businesses.filter((item: any) => {
			const matchesQuery = item["businessName"]
				.toLowerCase()
				.includes(query.toLowerCase());
			const matchesCategory = selectedCategory
				? item["category"] === selectedCategory
				: true; // If no category is selected, match all
			return matchesQuery && matchesCategory;
		});
		setFilteredResults(filtered);
	};

	const handleCategorySelect = (category: string | null) => {
		setSelectedCategory(category);

		const filtered = businesses.filter((item: any) => {
			const matchesQuery = item["businessName"]
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesCategory = category
				? item["category"] === category
				: true;
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
					<Text style={styles.emptyStateText}>
						Search for a business
					</Text>
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
						<TouchableOpacity
							key={index}
							style={styles.itemContainer}
						>
							<View
								style={[
									styles.initialCircle,
									{
										backgroundColor: item.color
											? item.color
											: [
													"#4338ca",
													"#38bdf8",
													"#059669",
													"#111827",
											  ][Math.floor(Math.random() * 4)],
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
										navigation.navigate(
											"SpecificBusinessPage",
											{
												id: item.businessID,
											}
										)
									}
								>
									<Text style={styles.itemName}>
										{item.businessName}
									</Text>
									<Text style={styles.itemDescription}>
										{item.description}
									</Text>
								</Pressable>
							</View>
							<Feather
								name="arrow-right-circle"
								size={32}
								color="black"
							/>
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
				const businessQuery = query(
					collection(FIRESTORE, "businessData")
				);
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

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelection = (category:any) => {
    handleCategorySelect(category);
    toggleDropdown();
  };


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
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDropdown}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedCategory === null ? 'All' : selectedCategory}
        </Text>
      </TouchableOpacity>

      <Modal visible={dropdownVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={toggleDropdown}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={['All', ...categories]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelection(item === 'All' ? null : item)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedCategory === item && styles.selectedCategoryText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>

			<ScrollView style={styles.resultsList}>
				{displayBusinesses()}
			</ScrollView>
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
	categoryScroll: {
		marginTop: 10,
		paddingLeft: 10,
		height: 5,
	},
	categoryButton: {
		backgroundColor: "#f3f4f6",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		marginRight: 10,
		height: 40,
	},
	selectedCategory: {
		backgroundColor: "#4338ca",
	},
	categoryText: {
		color: "#1F2937",
		fontSize: 14,
		fontWeight: "500",
	},
  dropdownContainer: {
    margin: 10,
  },
  dropdownButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: 300,
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },

});

export default SearchResults;
