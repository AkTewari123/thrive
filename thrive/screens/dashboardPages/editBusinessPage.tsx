import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  View,
} from "react-native";
import { Image } from "react-native-ui-lib";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { updateDoc, getDocs, query, where, collection } from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../FirebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DropDownPicker from 'react-native-dropdown-picker';


// Consistent color palette
const COLORS = {
  primary: "#6366F1", // Main brand color (purple)
  secondary: "#4F46E5", // Darker purple for hover states
  background: "#F3F4F6", // Light grey background
  surface: "#FFFFFF", // White surface
  text: {
    primary: "#1F2937", // Dark grey for primary text
    secondary: "#6B7280", // Medium grey for secondary text
    inverse: "#FFFFFF", // White text
  },
  border: "#E5E7EB", // Light grey for borders
  error: "#EF4444", // Red for errors
  success: "#10B981", // Green for success states
};


const EditBusinessPage: React.FC = () => {
	const [businessData, setBusinessData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState<any[]>([]);
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		image: "",
	});
	const [uploading, setUploading] = useState(false);
	const [transferred, setTransferred] = useState(0);
	const [imageUrl, setImageUrl] = useState<string>("");
	const [open, setOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState("food");
const [items, setItems] = useState([
  { label: 'Food', value: 'food' },
  { label: 'Service', value: 'service' },
  { label: 'Arts and Crafts', value: 'arts_crafts' },
  { label: 'Technology', value: 'technology' },
  { label: 'Retail', value: 'retail' },
]);


	const route = useRoute();
	const { id } = route.params as { id: string };
	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			headerTitle: "Edit Business Details",
			headerBackTitle: "Back",
		});
	}, [navigation]);

	useEffect(() => {
		const fetchBusinessData = async () => {
			setLoading(true);
			try {
				const q = query(
					collection(FIRESTORE, "businessData"),
					where("businessID", "==", id)
				);
				const querySnapshot = await getDocs(q);

				if (!querySnapshot.empty) {
					const doc = querySnapshot.docs[0];
					setBusinessData(doc.data());
					setProducts(doc.data()?.products || []);
				} else {
					console.log("No such document with the given businessID!");
					setBusinessData(null);
				}
			} catch (error) {
				console.error("Error fetching business data: ", error);
				setBusinessData(null);
			}
			setLoading(false);
		};

		fetchBusinessData();
	}, [id]);

	const handleSave = async () => {
		try {
			const q = query(
				collection(FIRESTORE, "businessData"),
				where("businessID", "==", id)
			);
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				const docRef = querySnapshot.docs[0].ref;
				await updateDoc(docRef, {
					...businessData,
					products,
					longDescription: businessData.longDescription,
					category: selectedCategory,
				});
				Alert.alert("Success", "Business information updated successfully!");
			} else {
				Alert.alert("Error", "No business found with the given ID.");
			}
		} catch (error) {
			Alert.alert("Error", "Failed to update business information.");
			console.error("Error updating business data: ", error);
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setBusinessData((prevData: any) => ({
			...prevData,
			[field]: value,
		}));
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = [...businessData.images];
		updatedImages.splice(index, 1);
		handleInputChange("images", updatedImages);
	};

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;
			try {
				const response = await fetch(uri);
				const blob = await response.blob();
				const storageRef = ref(storage, `businessImages/${Date.now()}.jpg`);
				const uploadTask = uploadBytesResumable(storageRef, blob);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						setTransferred(progress);
					},
					(error) => {
						console.error("Upload failed: ", error);
						Alert.alert("Error", `Image upload failed: ${error.message}`);
					},
					async () => {
						const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
						handleInputChange("images", [
							...(businessData.images || []),
							downloadUrl,
						]);
						Alert.alert("Success", "Image uploaded successfully!");
					}
				);
			} catch (error:any) {
				console.error("Upload failed: ", error);
				Alert.alert("Error", `Image upload failed: ${error.message}`);
			}
		}
	};

	const handleAddProduct = () => {
		if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.image) {
			Alert.alert("Error", "Please fill in all product fields.");
			return;
		}

		const updatedProducts = [...products, { ...newProduct, productID: Date.now() }];
		setProducts(updatedProducts);
		setNewProduct({ name: "", description: "", price: "", image: "" });
		Alert.alert("Success", "Product added successfully!");
	};

	const handleRemoveProduct = (index: number) => {
		const updatedProducts = [...products];
		updatedProducts.splice(index, 1);
		setProducts(updatedProducts);
		Alert.alert("Success", "Product removed successfully!");
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	const renderInputField = (
		label: string,
		value: string,
		onChangeText: (text: string) => void,
		icon: string,
		multiline: boolean = false,
		keyboardType: any = "default"
	  ) => (
		<View style={styles.inputWrapper}>
		  <Text style={styles.label}>{label}</Text>
		  <View style={styles.inputContainer}>
			<MaterialCommunityIcons
			  name={icon as any}
			  size={20}
			  color={COLORS.text.secondary}
			  style={styles.inputIcon}
			/>
			<TextInput
			  style={[
				styles.input,
				multiline && styles.multilineInput
			  ]}
			  value={value}
			  onChangeText={onChangeText}
			  multiline={multiline}
			  keyboardType={keyboardType}
			  placeholderTextColor={COLORS.text.secondary}
			/>
		  </View>
		</View>
	  );
	
	  const renderActionButton = (title: string, onPress: () => void, icon: string, color: string = COLORS.primary) => (
		<TouchableOpacity
		  style={[styles.actionButton, { backgroundColor: color }]}
		  onPress={onPress}
		>
		  <MaterialCommunityIcons
			name={icon as any}
			size={24}
			color={COLORS.text.inverse}
		  />
		  <Text style={styles.actionButtonText}>{title}</Text>
		</TouchableOpacity>
	  );
	
	  return (
		<SafeAreaView style={styles.container}>
  <FlatList
    data={[{ key: 'form' }]}  // FlatList requires data, so use a single dummy item
    renderItem={() => (
      <View style={styles.pageContainer}>
        {/* Business form fields */}
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons
            name="store-edit"
            size={40}
            color={COLORS.primary}
          />
          <Text style={styles.headerText}>Edit Business Profile</Text>
        </View>

        <View style={styles.formContainer}>
          {renderInputField(
            "Business Name",
            businessData?.businessName || "",
            (text) => handleInputChange("businessName", text),
            "store"
          )}

          {renderInputField(
            "Description",
            businessData?.description || "",
            (text) => handleInputChange("description", text),
            "text-box",
            true
          )}

          {renderInputField(
            "Long Description",
            businessData?.longDescription || "",
            (text) => handleInputChange("longDescription", text),
            "text-box-multiple",
            true
          )}

          {renderInputField(
            "Phone Number",
            businessData?.phoneNumber || "",
            (text) => handleInputChange("phoneNumber", text),
            "phone",
            false,
            "phone-pad"
          )}

          {renderInputField(
            "Location",
            businessData?.location || "",
            (text) => handleInputChange("location", text),
            "map-marker"
          )}

          {/* Dropdown for category */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Business Category</Text>

              <DropDownPicker
                open={open}
                value={selectedCategory}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedCategory}
                setItems={setItems}
                placeholder="Select a Category"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
          </View>

          {/* Images section */}
          <View style={[styles.sectionContainer, {alignContent:"center"}]}>
            <Text style={styles.sectionTitle}>Business Images</Text>
            {businessData?.images?.length > 0 ? (
              <FlatList
                data={businessData.images}
                keyExtractor={(item, index) => `image-${index}`}
                renderItem={({ item, index }) => (
                  <View style={styles.imageItem}>
                    <Image source={{ uri: item }} style={styles.image} />
                    {renderActionButton(
                      "Remove",
                      () => handleRemoveImage(index),
                      "delete",
                      COLORS.error
                    )}
                  </View>
                )}
                horizontal
              />
            ) : (
              <Text style={styles.emptyText}>No images available</Text>
            )}
            {renderActionButton(
              "Add Image",
              handlePickImage,
              "image-plus"
            )}
          </View>

          {/* Products section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Products</Text>
            {products.map((product, index) => (
              <View key={product.productID} style={styles.productItem}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <Text style={styles.productDescription}>
                  {product.description}
                </Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                {renderActionButton(
                  "Remove Product",
                  () => handleRemoveProduct(index),
                  "delete",
                  COLORS.error
                )}
              </View>
            ))}

            {/* Add product form */}
            <View style={styles.addProductForm}>
              <Text style={styles.subsectionTitle}>Add New Product</Text>
              {renderInputField(
                "Product Name",
                newProduct.name,
                (text) => setNewProduct({ ...newProduct, name: text }),
                "tag-text"
              )}
              {renderInputField(
                "Product Description",
                newProduct.description,
                (text) => setNewProduct({ ...newProduct, description: text }),
                "text-box",
                true
              )}
              {renderInputField(
                "Product Price",
                newProduct.price,
                (text) => setNewProduct({ ...newProduct, price: text }),
                "currency-usd",
                false,
                "numeric"
              )}
              {renderActionButton(
                "Add Product Image",
                handlePickImage,
                "image-plus"
              )}
              {renderActionButton(
                "Add Product",
                handleAddProduct,
                "plus-circle"
              )}
            </View>
          </View>

          {/* Save changes button */}
          {renderActionButton(
            "Save Changes",
            handleSave,
            "content-save",
            COLORS.success
          )}
        </View>
      </View>
    )}
    keyExtractor={(item) => item.key}
  />
</SafeAreaView>

	  );
	};
	
	const styles = StyleSheet.create({
	  container: {
		flex: 1,
		backgroundColor: COLORS.background,
	  },
	  pageContainer: {
		padding: 16,
	  },
	  headerContainer: {
		alignItems: "center",
		marginVertical: 24,
	  },
	  headerText: {
		fontSize: 28,
		fontWeight: "bold",
		color: COLORS.text.primary,
		marginTop: 8,
	  },
	  formContainer: {
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	  },
	  inputWrapper: {
		marginBottom: 16,
	  },
	  label: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.text.primary,
		marginBottom: 8,
	  },
	  inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
	  },
	  inputIcon: {
		padding: 12,
	  },
	  input: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: COLORS.text.primary,
	  },
	  multilineInput: {
		height: 100,
		textAlignVertical: "top",
	  },
	  pickerWrapper: {
		marginBottom: 16,
		zIndex: 1000, // Increase zIndex for iOS and Android
		elevation: 3, // Specifically for Android (elevation controls stacking order)
	  },
	  dropdown: {
		backgroundColor: COLORS.background,
		borderRadius: 12,
		borderColor: COLORS.border,
		paddingHorizontal: 10,
		marginBottom: 16,
		zIndex: 1000, // Ensure dropdown stays on top of other elements
	  },
	  dropdownContainer: {
		backgroundColor: COLORS.background,
		borderColor: COLORS.border,
		borderRadius: 12,
		zIndex: 999, // Ensure the container (dropdown items) appears above other elements
	  },	
	  pickerContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: COLORS.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
		height: 60,  // Increased height
		paddingHorizontal: 10,  // Padding for spacing
		marginBottom: 16,  // Ensure space below picker
	  },
	  picker: {
		flex: 1,
		height: 60,  // Match the container height
	  },
	  
	  sectionContainer: {
		marginTop: 24,
		marginBottom: 16,
	  },
	  sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: COLORS.text.primary,
		marginBottom: 16,
	  },
	  subsectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.text.primary,
		marginBottom: 16,
	  },
	  imageItem: {
		marginRight: 16,
		marginBottom: 16,
	  },
	  image: {
		width: 150,
		height: 150,
		borderRadius: 12,
		marginBottom: 8,
	  },
	  productItem: {
		backgroundColor: COLORS.background,
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	  },
	  
	  
	  productTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.text.primary,
		marginBottom: 8,
	  },
	  productDescription: {
		fontSize: 16,
		color: COLORS.text.secondary,
		marginBottom: 8,
	  },
	  productPrice: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.primary,
		marginBottom: 8,
	  },
	  productImage: {
		width: 200,
		height: 200,
		borderRadius: 12,
		marginBottom: 8,
	  },
	  addProductForm: {
		backgroundColor: COLORS.background,
		borderRadius: 12,
		padding: 16,
		marginTop: 16,
	  },
	  actionButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 24,
		marginVertical: 8,
		gap: 8,
	  },
	  actionButtonText: {
		color: COLORS.text.inverse,
		fontSize: 16,
		fontWeight: "600",
	  },
	  emptyText: {
		color: COLORS.text.secondary,
		fontSize: 16,
		fontStyle: "italic",
		marginBottom: 16,
	  },
	});
	
	export default EditBusinessPage;
