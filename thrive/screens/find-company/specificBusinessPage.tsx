import React, { useEffect, useState, useCallback } from "react";
import {
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	SafeAreaView,
	View,
	ScrollView,
	Alert,
	TextInput,
	ActivityIndicator,
} from "react-native";
import { Image } from "react-native-ui-lib";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE } from "../../FirebaseConfig";
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	arrayUnion,
	Timestamp,
} from "firebase/firestore";
import { format } from 'date-fns';

// Consistent color palette
const COLORS = {
	primary: '#6366F1',     // Main brand color (purple)
	secondary: '#4F46E5',   // Darker purple for hover states
	background: '#F3F4F6',  // Light grey background
	surface: '#FFFFFF',     // White surface
	text: {
		primary: '#1F2937',   // Dark grey for primary text
		secondary: '#6B7280', // Medium grey for secondary text
		inverse: '#FFFFFF',   // White text
	},
	border: '#E5E7EB',      // Light grey for borders
	error: '#EF4444',       // Red for errors
	success: '#10B981',     // Green for success states
};

interface ReviewProps {
	username: string;
	rating: number;
	review: string;
}

const Review: React.FC<ReviewProps> = ({ username, rating, review }) => {
	const stars = Array.from({ length: 5 }, (_, i) => (
		<FontAwesome
			key={i}
			name={i < rating ? "star" : "star-o"}
			size={16}
			color={i < rating ? COLORS.primary : COLORS.text.secondary}
			style={{ marginRight: 4 }}
		/>
	));

	return (
		<View style={styles.reviewCard}>
			<Text style={styles.reviewUsername}>{username}</Text>
			<View style={styles.starsContainer}>{stars}</View>
			<Text style={styles.reviewText}>{review}</Text>
		</View>
	);
};

const SpecificBusinessPage: React.FC = () => {
	const [businessData, setBusinessData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [idx, setIdx] = useState(0);

	const route = useRoute();
	const { width } = Dimensions.get("window");
	const { id } = route.params as { id: string };
	let scale = width / 35;
	const [newReview, setNewReview] = useState<string>("");
	const [newUsername, setNewUsername] = useState<string>("");
	const [newRating, setNewRating] = useState<number>(0);
	const [submitting, setSubmitting] = useState(false); // For form submission state

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
				const data = doc.data();
				setBusinessData(data);
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

	useFocusEffect(
		useCallback(() => {
			fetchBusinessData();

			return () => {
				setBusinessData(null); // Reset business data when leaving the screen if needed
			};
		}, [id])
	);



	const navigation = useNavigation();

	const businessName = businessData?.businessName || "Not defined";
	const businessDescription = businessData?.longDescription || "Not defined";
	const phoneNumber = businessData?.phoneNumber || "Not defined";
	const address = businessData?.location || "Not defined";
	const schedule = businessData?.schedule || {};
	const images = businessData?.images || [];
	const reviews = businessData?.reviews || [
		{ username: "None", rating: 0, review: "No Reviews" },
	];
	const email = businessData?.email || "Not defined";
	const products = businessData?.products || [];

	useEffect(() => {
		if (businessData) {
			navigation.setOptions({
				headerTitle: businessName,
				headerBackTitle: "Back",
			});
		} else {
			navigation.setOptions({
				headerTitle: "Loading...",
				headerBackTitle: "Back",
			});
		}
	}, [businessName, navigation]);

	let sum = 0;
	for (let i = 0; i < reviews.length; i++) {
		sum += reviews[i].rating;
	}
	const numStars = reviews.length > 0 ? sum / reviews.length : 0;

	useEffect(() => {
		const interval = setInterval(() => {
			setIdx((prevIdx) =>
				prevIdx < reviews.length - 1 ? prevIdx + 1 : 0
			);
		}, 10000);

		return () => clearInterval(interval);
	}, [reviews.length]);

	let displayDate: string = "0";
	let tdy = format(new Date(), "iiii");
	if (schedule[tdy]) {
		displayDate = `${schedule[tdy][0]}-${schedule[tdy][1]}`;
	}

	const handleSubmitReview = async () => {
		const user = FIREBASE_AUTH.currentUser;
		if (!newReview || newRating === 0) {
			alert("Please fill in all fields before submitting.");
			return;
		}

		setSubmitting(true); // Set submitting state to true to show a loading spinner

		const reviewData = {
			// set username to the user email before the @ symbol
			username: user?.email?.split("@")[0] || newUsername,
			rating: newRating,
			review: newReview,
		};

		try {
			const q = query(
				collection(FIRESTORE, "businessData"),
				where("businessID", "==", id)
			);

			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				const businessDoc = querySnapshot.docs[0];
				const businessDocRef = businessDoc.ref;

				await updateDoc(businessDocRef, {
					reviews: arrayUnion(reviewData),
				});

				alert("Review submitted successfully!");

				// Reset the form after successful submission
				setNewReview("");
				setNewUsername("");
				setNewRating(0);

				// Fetch the updated business data
				await fetchBusinessData();
			} else {
				alert("Business not found.");
			}
		} catch (error) {
			console.error("Error submitting review: ", error);
			alert("Failed to submit review. Please try again.");
		}

		setSubmitting(false); // Stop the loading spinner
	};

	const starHollowed = Array.from({ length: 5 }, (_, i) =>
		i < numStars ? "star" : "star-o"
	);

	const handleOrder = async (
		productId: string,
		productImage: string,
		productPrice: number,
		productName: string
	) => {
		const user = FIREBASE_AUTH.currentUser;
		const userId = user?.email; // Replace this with actual user ID from authentication
		const orderData = {
			productId: productId,
			userId: userId,
			productImage: productImage, // Add the product image URL to the order data
			productPrice: productPrice, // Add the product price to the order data
			productName: productName, // Add the product name to the order data
			timestamp: Timestamp.now(),
			fulfilled: false,
		};

		try {
			// Query to find the specific business document by ID, similar to useFocusEffect
			const q = query(
				collection(FIRESTORE, "businessData"),
				where("businessID", "==", id)
			);

			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				const businessDoc = querySnapshot.docs[0]; // Get the document reference
				const businessDocRef = businessDoc.ref; // Reference to the current business document

				// Update the 'orders' array by adding the new order
				await updateDoc(businessDocRef, {
					orders: arrayUnion(orderData), // Add new order to the 'orders' array field
				});

				alert("Order placed successfully!");
			} else {
				console.error("No such document with the given businessID!");
				alert("Failed to place order: business not found.");
			}
		} catch (error) {
			console.error("Error placing order: ", error);
			alert("Failed to place the order. Please try again.");
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size="large" color="#0000ff" />
			</SafeAreaView>
		);
	}

	if (!businessData) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Business data not found</Text>
			</SafeAreaView>
		);
	}

	const starCounts = [5, 4, 3, 2, 1].map(
		(star) => reviews.filter((review: any) => review.rating === star).length
	);

	const totalReviews = reviews.length;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				{/* Header Section */}
				<View style={styles.headerSection}>
						<View style={styles.headerRow}>
							<View>
								<Text style={styles.businessName}>{businessName}</Text>
								<View style={styles.ratingContainer}>
									{Array.from({ length: 5 }).map((_, i) => (
										<FontAwesome
											key={i}
											name={i < numStars ? "star" : "star-o"}
											size={20}
											color={i < numStars ? COLORS.primary : COLORS.text.secondary}
										/>
									))}
									<Text style={styles.ratingText}>({reviews.length} {reviews.length == 1 ? "review" : "reviews"})</Text>
								</View>
							</View>
							<TouchableOpacity
								style={styles.viewPostsButton}
								onPress={() => navigation.navigate('CompanyPostHistory', {businessID: businessData?.businessID,})}
							>
								<MaterialCommunityIcons name="post" size={20} color={COLORS.text.inverse} />
								<Text style={styles.viewPostsButtonText}>Posts</Text>
							</TouchableOpacity>
						</View>
					</View>

				{/* Image Carousel */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.carouselContainer}
				>
					{images.map((image: any, index: any) => (
						<Image
							key={`image-${index}`}
							source={{ uri: image }}
							style={styles.carouselImage}
						/>
					))}
				</ScrollView>

				{/* Business Info Card */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>About</Text>
					<Text style={styles.descriptionText}>{businessDescription}</Text>

					<View style={styles.contactInfo}>
						<View style={styles.contactItem}>
							<MaterialCommunityIcons name="phone" size={24} color={COLORS.primary} />
							<Text style={styles.contactText}>{phoneNumber}</Text>
						</View>
						<View style={styles.contactItem}>
							<MaterialCommunityIcons name="map-marker" size={24} color={COLORS.primary} />
							<Text style={styles.contactText}>{address}</Text>
						</View>
					</View>
				</View>

				{/* Products Section */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Products</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{products.map((product: any, index: any) => (
							<View key={index} style={styles.productCard}>
								<Image source={{ uri: product.image }} style={styles.productImage} />
								<Text style={styles.productTitle}>{product.name}</Text>
								<Text style={styles.productPrice}>${product.price}</Text>
								<TouchableOpacity
									style={styles.orderButton}
									onPress={() => handleOrder(product.productID, product.image, product.price, product.name)}
								>
									<Text style={styles.orderButtonText}>Order Now</Text>
								</TouchableOpacity>
							</View>
						))}
					</ScrollView>
				</View>

				{/* Reviews Section */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Reviews</Text>
					<View>
						{reviews.map((review: any, index: any) => (
							<Review
								key={index}
								username={review.username}
								rating={review.rating}
								review={review.review}
							/>
						))}
					</View>

					{/* Add Review Form */}
					<View style={styles.addReviewSection}>
						<Text style={styles.subsectionTitle}>Write a Review</Text>
						<View style={styles.ratingInput}>
							{Array.from({ length: 5 }).map((_, i) => (
								<TouchableOpacity key={i} onPress={() => setNewRating(i + 1)}>
									<FontAwesome
										name={i < newRating ? "star" : "star-o"}
										size={24}
										color={i < newRating ? COLORS.primary : COLORS.text.secondary}
									/>
								</TouchableOpacity>
							))}
						</View>
						<TextInput
							style={styles.reviewInput}
							placeholder="Share your experience..."
							multiline
							value={newReview}
							onChangeText={setNewReview}
						/>
						<TouchableOpacity
							style={styles.submitButton}
							onPress={handleSubmitReview}
							disabled={submitting}
						>
							<Text style={styles.submitButtonText}>
								{submitting ? "Submitting..." : "Submit Review"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	scrollView: {
		flex: 1,
	},
	headerSection: {
		padding: 20,
		backgroundColor: COLORS.surface,
	},
	businessName: {
		fontSize: 28,
		fontWeight: "bold",
		color: COLORS.text.primary,
		marginBottom: 8,
	},
	ratingContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	ratingText: {
		marginLeft: 8,
		color: COLORS.text.secondary,
	},
	carouselContainer: {
		height: 200,
		marginBottom: 16,
	},
	carouselImage: {
		width: 300,
		height: 200,
		marginHorizontal: 8,
		borderRadius: 12,
	},
	card: {
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		padding: 20,
		marginHorizontal: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: COLORS.text.primary,
		marginBottom: 16,
	},
	descriptionText: {
		fontSize: 16,
		color: COLORS.text.secondary,
		lineHeight: 24,
		marginBottom: 16,
	},
	contactInfo: {
		marginTop: 16,
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	contactText: {
		marginLeft: 12,
		fontSize: 16,
		color: COLORS.text.secondary,
	},
	productCard: {
		width: 200,
		backgroundColor: COLORS.surface,
		borderRadius: 12,
		padding: 16,
		marginRight: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	productImage: {
		width: "100%",
		height: 150,
		borderRadius: 8,
		marginBottom: 12,
	},
	productTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.text.primary,
		marginBottom: 4,
	},
	productPrice: {
		fontSize: 18,
		fontWeight: "bold",
		color: COLORS.primary,
		marginBottom: 12,
	},
	orderButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 8,
		padding: 12,
		alignItems: "center",
	},
	orderButtonText: {
		color: COLORS.text.inverse,
		fontWeight: "600",
	},
	reviewCard: {
		backgroundColor: COLORS.background,
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	reviewUsername: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.text.primary,
		marginBottom: 4,
	},
	starsContainer: {
		flexDirection: "row",
		marginBottom: 8,
	},
	reviewText: {
		fontSize: 14,
		color: COLORS.text.secondary,
		lineHeight: 20,
	},
	addReviewSection: {
		marginTop: 24,
		paddingTop: 24,
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
	},
	subsectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.text.primary,
		marginBottom: 16,
	},
	ratingInput: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 16,
		gap: 8,
	},
	reviewInput: {
		backgroundColor: COLORS.background,
		borderRadius: 12,
		padding: 16,
		height: 120,
		textAlignVertical: "top",
		marginBottom: 16,
	},
	submitButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
	},
	submitButtonText: {
		color: COLORS.text.inverse,
		fontSize: 16,
		fontWeight: "600",
	},
	headerSection: {
		padding: 20,
		backgroundColor: COLORS.surface,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	viewPostsButton: {
		backgroundColor: COLORS.primary,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		gap: 4,
	},
	viewPostsButtonText: {
		color: COLORS.text.inverse,
		fontSize: 14,
		fontWeight: '600',
	},
});

export default SpecificBusinessPage;