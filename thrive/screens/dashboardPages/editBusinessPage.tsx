import React, { useEffect, useState } from "react";
import {
	Text,
	StyleSheet,
	SafeAreaView,
	TextInput,
	Button,
	Alert,
	FlatList,
} from "react-native";
import { Image, View } from "react-native-ui-lib";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { updateDoc, getDocs, query, where, collection } from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../FirebaseConfig";
import { Picker } from "@react-native-picker/picker";

const COLORS = {
	primary: '#6366F1', // Main brand color (purple)
	secondary: '#4F46E5', // Darker purple for hover states
	background: '#F3F4F6', // Light grey background
	surface: '#FFFFFF', // White surface
	text: {
		primary: '#1F2937', // Dark grey for primary text
		secondary: '#6B7280', // Medium grey for secondary text
		inverse: '#FFFFFF', // White text
	},
	border: '#E5E7EB', // Light grey for borders
	error: '#EF4444', // Red for errors
	success: '#10B981', // Green for success states
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
	const [selectedCategory, setSelectedCategory] = useState<string>("food");

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
				<View style={[styles.inputContainer, styles.childContainer]}>
					<Text style={styles.label}>Business Name</Text>
					<TextInput
						style={styles.input}
						value={businessData?.businessName || ""}
						onChangeText={(text) => handleInputChange("businessName", text)}
					/>

					<Text style={styles.label}>Description</Text>
					<TextInput
						style={[styles.input]}
						value={businessData?.description || ""}
						onChangeText={(text) => handleInputChange("description", text)}
					/>

					<Text style={styles.label}>Long Description</Text>
					<TextInput
						style={[styles.input, styles.longDescriptionInput]}
						value={businessData?.longDescription || ""}
						onChangeText={(text) => handleInputChange("longDescription", text)}
						multiline
					/>

					<Text style={styles.label}>Phone Number</Text>
					<TextInput
						style={styles.input}
						value={businessData?.phoneNumber || ""}
						onChangeText={(text) => handleInputChange("phoneNumber", text)}
						keyboardType="phone-pad"
					/>

					<Text style={styles.label}>Location</Text>
					<TextInput
						style={styles.input}
						value={businessData?.location || ""}
						onChangeText={(text) => handleInputChange("location", text)}
					/>

					<Text style={styles.label}>Business Category</Text>
					<Picker
						selectedValue={selectedCategory}
						onValueChange={(itemValue) => setSelectedCategory(itemValue)}
						style={styles.picker}
					>
						<Picker.Item label="Food" value="food" />
						<Picker.Item label="Service" value="service" />
						<Picker.Item label="Arts and Crafts" value="arts_crafts" />
						<Picker.Item label="Technology" value="technology" />
						<Picker.Item label="Retail" value="retail" />
					</Picker>
				</View>

				{/* Image picker and upload section */}
				<View style={[styles.inputContainer, styles.childContainer]}>
					<Text style={styles.label}>Current Images</Text>
					{businessData?.images?.length > 0 ? (
						<FlatList
							data={businessData.images}
							keyExtractor={(item, index) => `image-${index}`}
							renderItem={({ item, index }) => (
								<View style={styles.imageItem}>
									<Image source={{ uri: item }} style={styles.image} />
									<Button title="Remove" onPress={() => handleRemoveImage(index)} />
								</View>
							)}
							horizontal
						/>
					) : (
						<Text>No images available</Text>
					)}
					<Button title="Add Image from Camera Roll" onPress={handlePickImage} />
					{uploading && (
						<Text style={styles.uploadingText}>
							Uploading... {transferred}% completed
						</Text>
					)}
				</View>

				{/* Products Section */}
				<View style={[styles.inputContainer, styles.childContainer]}>
					<Text style={[styles.label, { alignSelf: "center" }]}>Products</Text>
					{products.length > 0 ? (
						products.map((product, index) => (
							<View key={product.productID} style={styles.productItem}>
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
					<Button title="Add Product Image" onPress={handlePickImage} />
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
	longDescriptionInput: {
		height: 150,
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
	},
});

export default EditBusinessPage;
