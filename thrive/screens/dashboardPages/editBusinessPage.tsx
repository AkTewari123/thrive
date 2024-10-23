import React, { useEffect, useState } from "react";
import {
	Text,
	StyleSheet,
	SafeAreaView,
	TextInput,
	Button,
	Alert,
	FlatList,
	Touchable,
} from "react-native";
import { Image, TouchableOpacity, View } from "react-native-ui-lib";
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import {
	updateDoc,
	getDocs,
	query,
	where,
	collection,
} from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../FirebaseConfig";
import { Picker } from "@react-native-picker/picker";

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
	const [transferred, setTransferred] = useState(0); // Track upload progress
	const [imageUrl, setImageUrl] = useState<string>(""); // For URL input

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
					setProducts(doc.data()?.products || []); // Set initial products
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
				await updateDoc(docRef, { ...businessData, products, category: selectedCategory });
				Alert.alert(
					"Success",
					"Business information updated successfully!"
				);
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
		updatedImages.splice(index, 1); // Remove the selected image
		handleInputChange("images", updatedImages); // Update the business data with new images
	};

	// Function to handle URL image upload
	const handleUrlUpload = async () => {
		if (!imageUrl.trim()) {
			Alert.alert("Error", "Please enter a valid image URL.");
			return;
		}

		// Add URL to images array
		handleInputChange("images", [...(businessData.images || []), imageUrl.trim()]);
		setImageUrl(""); // Clear the input field after adding the URL
		Alert.alert("Success", "Image URL added!");
	};

	// Function to pick an image from the library or camera for business images
	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri; // Get the image URI

			try {
				const response = await fetch(uri);
				const blob = await response.blob(); // Convert to blob

				// Reference to Firebase Storage
				const storageRef = ref(storage, `businessImages/${Date.now()}.jpg`);

				// Create the upload task
				const uploadTask = uploadBytesResumable(storageRef, blob);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Track upload progress
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						setTransferred(progress);

						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						console.error("Upload failed: ", error);
						Alert.alert("Error", `Image upload failed: ${error.message}`);
					},
					async () => {
						// Handle successful uploads
						const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
						handleInputChange("images", [...(businessData.images || []), downloadUrl]);
						Alert.alert("Success", "Image uploaded successfully!");
					}
				);
			} catch (error: any) {
				console.error("Upload failed: ", error);
				Alert.alert("Error", `Image upload failed: ${error.message}`);
			}
		}
	};

	// Function to pick an image from the library or camera for product images
	const handlePickProductImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri; // Get the image URI

			try {
				const response = await fetch(uri);
				const blob = await response.blob(); // Convert to blob

				// Reference to Firebase Storage
				const storageRef = ref(storage, `productImages/${Date.now()}.jpg`);

				// Create the upload task
				const uploadTask = uploadBytesResumable(storageRef, blob);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Track upload progress
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						setTransferred(progress);

						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						console.error("Upload failed: ", error);
						Alert.alert("Error", `Image upload failed: ${error.message}`);
					},
					async () => {
						// Handle successful uploads
						const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
						setNewProduct({ ...newProduct, image: downloadUrl });
						Alert.alert("Success", "Product image uploaded successfully!");
					}
				);
			} catch (error: any) {
				console.error("Upload failed: ", error);
				Alert.alert("Error", `Product image upload failed: ${error.message}`);
			}
		}
	};
	const [selectedCategory, setSelectedCategory] = useState<string>("food"); // State for selected category


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

	// Function to remove a product by index
	const handleRemoveProduct = (index: number) => {
		const updatedProducts = [...products];
		updatedProducts.splice(index, 1); // Remove the selected product
		setProducts(updatedProducts); // Update the state with new product list
		Alert.alert("Success", "Product removed successfully!");
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.pageContainer}>
				<Text
					style={{
						textAlign: "center",
						fontSize: 30,
						paddingVertical: 20,
					}}
				>
					Edit Business Information
				</Text>

				{/* Business Information Fields */}
				<View style={styles.inputContainer}>
					
				</View>

				<View style={styles.inputContainer}>
					
				</View>

				<View style={[styles.inputContainer, styles.childContainer]}>
                <Text style={styles.label}>Business Name</Text>
					<TextInput
						style={styles.input}
						value={businessData?.businessName || ""}
						onChangeText={(text) =>
							handleInputChange("businessName", text)
						}
					/>
                <Text style={styles.label}>Description</Text>
					<TextInput
						style={[styles.input, styles.descriptionInput]}
						value={businessData?.description || ""}
						onChangeText={(text) =>
							handleInputChange("description", text)
						}
						multiline
					/>
					<Text style={styles.label}>Phone Number</Text>
					<TextInput
						style={styles.input}
						value={businessData?.phoneNumber || ""}
						onChangeText={(text) =>
							handleInputChange("phoneNumber", text)
						}
						keyboardType="phone-pad"
					/>
                    <Text style={styles.label}>Location</Text>
					<TextInput
						style={styles.input}
						value={businessData?.location || ""}
						onChangeText={(text) =>
							handleInputChange("location", text)
						}
					/>

					{/* Category Selection */}
					<Text style={styles.label}>Business Category</Text>
					<Picker
						selectedValue={selectedCategory}
						onValueChange={(itemValue) =>
							setSelectedCategory(itemValue)
						}
						style={styles.picker} // Add some styling to the picker
					>
						<Picker.Item label="Food" value="food" />
						<Picker.Item label="Service" value="service" />
						<Picker.Item label="Arts and Crafts" value="arts_crafts" />
						<Picker.Item label="Technology" value="technology" />
						<Picker.Item label="Retail" value="retail" />
					</Picker>
				</View>

				<View style={styles.inputContainer}>
					
				</View>

				{/* Image picker and upload section */}
				<View style={[styles.inputContainer, styles.childContainer, {alignItems:"center"}]}>
					<Text style={styles.label}>Current Images</Text>
					{businessData?.images?.length > 0 ? (
						<FlatList
							data={businessData.images}
							keyExtractor={(item, index) => `image-${index}`}
							renderItem={({ item, index }) => (
								<View style={styles.imageItem}>
									<Image
										source={{ uri: item }}
										style={styles.image}
									/>
									<Button
										title="Remove"
										onPress={() => handleRemoveImage(index)}
									/>
								</View>
							)}
							horizontal
						/>
					) : (
						<Text>No images available</Text>
					)}
                    <Button
						title="Add Image from Camera Roll"
						onPress={handlePickImage}
					/>
					{uploading && (
						<Text style={styles.uploadingText}>
							Uploading... {transferred}% completed
						</Text>
					)}
				</View>

				{/* Products Section */}
				<View style={[styles.inputContainer, styles.childContainer]}>
					<Text style={[styles.label, {alignSelf:"center"}]}>Products</Text>

					{products.length > 0 ? (
						products.map((product, index) => (
							<View key={product.productID} style={[styles.productItem, {alignSelf:"center", alignItems:"center"}]}>
								<Text style={styles.productText}>Name: {product.name}</Text>
								<Text style={styles.productText}>Description: {product.description}</Text>
								<Text style={styles.productText}>Price: ${product.price}</Text>
								<Image source={{ uri: product.image }} style={styles.image} />
								<Button title="Remove Product" onPress={() => handleRemoveProduct(index)} />
							</View>
						))
					) : (
						<Text>No products added yet.</Text>
					)}

					{/* New Product Form */}
					<Text style={styles.label}>Add New Product</Text>
					<TextInput
						style={styles.input}
						value={newProduct.name}
						onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
						placeholder="Product Name"
					/>
					<TextInput
						style={styles.input}
						value={newProduct.description}
						onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
						placeholder="Product Description"
						multiline
					/>
					<TextInput
						style={styles.input}
						value={newProduct.price}
						onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
						placeholder="Product Price"
						keyboardType="numeric"
					/>
					<Button title="Add Product Image" onPress={handlePickProductImage} />
					<Button title="Add Product" onPress={handleAddProduct} />
				</View>

				<View style={styles.buttonContainer}>
					<Button title="Save Changes" onPress={handleSave} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F4F4F4",
	},
	pageContainer: {
		padding: 15,
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
	},
	input: {
		backgroundColor: "#FFF",
		padding: 10,
		marginVertical: 5,
		borderRadius: 5,
		borderColor: "#CCC",
		borderWidth: 1,
		fontSize: 16,
	},
	descriptionInput: {
		height: 120,
		textAlignVertical: "top",
	},
	buttonContainer: {
		marginTop: 20,
		marginBottom: 30,
	},
	imageItem: {
		marginRight: 10,
		alignItems: "center",
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 10,
	},
	uploadingText: {
		textAlign: "center",
		marginVertical: 10,
		fontSize: 16,
		color: "gray",
	},
	productItem: {
		marginVertical: 10,
	},
	productText: {
		fontSize: 16,
	},
	picker: {
		backgroundColor: "#FFF",
		borderWidth: 1,
		borderColor: "#CCC",
		marginTop: 10,
		borderRadius: 5,
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

export default EditBusinessPage;
