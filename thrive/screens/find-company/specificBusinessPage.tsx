import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import {
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	SafeAreaView,
	Button,
} from "react-native";
import {
	Carousel,
	Image,
	View,
	ProgressBar,
	Colors,
} from "react-native-ui-lib";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import thriveHeader from "../components/thriveHeader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { format } from "date-fns";
import { ScrollView } from "react-native-gesture-handler";
import * as Progress from "react-native-progress";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ActivityIndicator } from "react-native";
import { FIRESTORE } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import BusinessNavBar from "../components/businessNavbar";
import { LogBox } from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
	collection,
	query,
	where,
	getDocs,
	addDoc,
	Timestamp,
	arrayUnion,
	updateDoc,
	doc,
} from "firebase/firestore"; // Adjust this according to your Firestore setup
import { TextInput } from "react-native-gesture-handler";

LogBox.ignoreLogs(["Warning: Encountered two children with the same key"]);

interface ReviewProps {
	username: string;
	rating: number;
	review: string;
}

const Review: React.FC<ReviewProps> = ({ username, rating, review }) => {
	const starHollowed = Array.from({ length: 5 }, (_, i) =>
		i < rating ? "star" : "star-o"
	);
	return (
		<>
			<View
				style={{
					padding: 15,
					borderRadius: 20,
					backgroundColor: "#F9F9F9",
					shadowOffset: { width: -2, height: 4 },
					shadowOpacity: 0.2,
					shadowRadius: 3,
					width: "85%",
					marginHorizontal: "auto",
				}}
			>
				<Text
					style={{
						fontSize: 28,
						fontWeight: 300,
					}}
				>
					{username}
				</Text>
				<Text>
					{starHollowed.map((star, index) => (
						<FontAwesome key={index} name={star} size={20} />
					))}
				</Text>
				<Text style={{}}>{review}</Text>
			</View>
		</>
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
	const businessDescription = businessData?.description || "Not defined";
	const phoneNumber = businessData?.phoneNumber || "Not defined";
	const address = businessData?.location || "Not defined";
	const schedule = businessData?.schedule || {};
	const images = businessData?.images || [];
	const reviews = businessData?.reviews || [
		{ username: "None", rating: 5, review: "No Reviews" },
	];
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
		<>
			<SafeAreaView></SafeAreaView>
			<ScrollView style={styles.pageContainer}>
				<View style={[styles.childContainer, styles.topContainer]}>
					<View style={styles.businessInfoContainer}>
						<View
							style={[
								styles.initialCircle,
								{ backgroundColor: "#6096F7" },
							]}
						>
							<Text style={styles.initialText}>
								{businessName.slice(0, 1)}
							</Text>
						</View>
						<View style={styles.businessDetails}>
							<Text style={styles.businessName}>
								{businessName}
							</Text>
							<Text>
								{starHollowed.map((star, index) => (
									<FontAwesome
										key={index}
										name={star}
										size={15}
										color="black"
									/>
								))}{" "}
								{numStars} stars
							</Text>
						</View>
					</View>
				</View>

				<View
					style={[
						styles.childContainer,
						styles.middleContainer,
						{ flex: 1 },
					]}
				>
					<Text style={styles.sectionTitle}>Our Business</Text>
					<ScrollView
						style={styles.businessDescriptionScroll}
						contentContainerStyle={{ flexGrow: 1 }}
					>
						<Text style={styles.businessDescriptionText}>
							{businessDescription}
						</Text>
					</ScrollView>
				</View>

				<View style={styles.childContainer}>
					<Text
						style={[{ textAlign: "center" }, styles.sectionTitle]}
					>
						Contact Info
					</Text>
					<View style={styles.contactInfo}>
						<Text style={styles.contactText}>
							<Feather name="phone-outgoing" size={34} />
							{"\n "}
							{"\n "}
							{phoneNumber}
						</Text>
						<Text style={styles.contactText}>
							<Entypo name="location" size={34} />

							{"\n "}
							{"\n "}
							{address}
						</Text>
						<Text style={styles.contactText}>
							<AntDesign name="clockcircle" size={34} />
							{"\n "}
							{"\n "}
							{displayDate}
						</Text>
					</View>
				</View>

				<View style={[styles.childContainer, styles.middleContainer]}>
					<Text style={[styles.sectionTitle, { paddingBottom: 10 }]}>
						Gallery
					</Text>
					<Carousel
						containerStyle={styles.carouselContainer}
						loop
						pageControlPosition={Carousel.pageControlPositions.OVER}
						showCounter
						autoplay
					>
						{images.map((image: any, index: any) => {
							const key = `carousel-image-${index}-${businessName}`;
							console.log("Key:", key); // Log each key
							return (
								<View flex centerV key={key}>
									<Image
										overlayType={Image.overlayTypes.BOTTOM}
										style={styles.carouselImage}
										source={{ uri: image }}
										resizeMode="cover"
										borderRadius={30}
									/>
								</View>
							);
						})}
					</Carousel>
				</View>

				{/* Products Section */}
				<View style={[styles.childContainer, styles.middleContainer]}>
					<Text style={styles.sectionTitle}>Products</Text>
					{products.length > 0 ? (
						products.map((product: any, index: any) => (
							<View key={index} style={styles.productItem}>
								<Text style={styles.productTitle}>
									{product.name}
								</Text>
								<Image
									source={{ uri: product.image }}
									style={styles.productImage}
								/>
								<Text style={styles.productDescription}>
									{product.description}
								</Text>
								<Text style={styles.productPrice}>
									${product.price}
								</Text>
								<Button
									title="Order"
									onPress={() =>
										handleOrder(
											product.productID,
											product.image,
											product.price,
											product.name
										)
									}
								/>
							</View>
						))
					) : (
						<Text>No products available</Text>
					)}
				</View>
				{/* Ratings & Reviews Section */}
				<View style={[styles.childContainer, styles.middleContainer]}>
					<Text style={styles.sectionTitle}>Ratings & Reviews</Text>
					<View style={styles.ratingsContainer}>
						<View>
							<Text style={styles.averageRatingText}>
								{numStars.toFixed(1)}
							</Text>
							<Text style={styles.outOfText}>out of 5 stars</Text>
						</View>
						<View style={styles.starBarsContainer}>
							{starCounts.map((count, index) => (
								<View key={index} style={styles.starRow}>
									<Text>
										<FontAwesome
											name="star"
											size={15}
											color="black"
										/>{" "}
										{5 - index} stars
									</Text>
									<ProgressBar
										progress={
											totalReviews
												? count / totalReviews
												: 0
										}
										progressColor="#1415D0"
										style={styles.progressBars}
									/>
									<Text style={styles.ratingNum}>
										({count})
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>

				<View style={[styles.childContainer, styles.middleContainer]}>
					<View>
						<Text
							style={[
								styles.sectionTitle,
								{ textAlign: "center" },
							]}
						>
							Customers
						</Text>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								marginTop: 5,
							}}
						>
							<TouchableOpacity
								onPress={() =>
									setIdx(
										idx > 0 ? idx - 1 : reviews.length - 1
									)
								}
								style={{ marginTop: "13%" }}
							>
								<FontAwesomeIcon icon={faArrowLeft} size={20} />
							</TouchableOpacity>
							<Review
								username={reviews[idx].username}
								rating={reviews[idx].rating}
								review={reviews[idx].review}
							/>
							<TouchableOpacity
								onPress={() =>
									setIdx((idx + 1) % reviews.length)
								}
								style={{ marginTop: "13%" }}
							>
								<FontAwesomeIcon
									icon={faArrowRight}
									size={20}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				{/* Add Review Section */}
				<View style={[styles.childContainer, styles.middleContainer]}>
					<Text style={styles.sectionTitle}>Add a Review</Text>

					<View style={styles.inputContainer}>
						<Text>Rating (1-5)</Text>
						<TextInput
							style={styles.input}
							keyboardType="numeric"
							placeholder="Enter your rating"
							value={newRating ? newRating.toString() : ""}
							onChangeText={(value) =>
								setNewRating(parseInt(value) || 0)
							}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text>Review</Text>
						<TextInput
							style={[
								styles.input,
								{ height: 100, textAlignVertical: "top" },
							]}
							placeholder="Write your review here"
							value={newReview}
							onChangeText={setNewReview}
							multiline
						/>
					</View>

					<Button
						title={submitting ? "Submitting..." : "Submit Review"}
						onPress={handleSubmitReview}
						disabled={submitting}
					/>
				</View>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#E4E8EE",
	},
	pageContainer: {
		paddingVertical: 10,
		flex: 1,
		backgroundColor: "transparent",
		paddingHorizontal: 25,
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
	topContainer: {
		marginBottom: 20,
	},
	businessInfoContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	initialCircle: {
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
	},
	initialText: {
		color: "white",
		fontSize: 24,
		fontWeight: "500",
	},
	businessDetails: {
		marginLeft: 15,
	},
	businessName: {
		fontWeight: "500",
		fontSize: 30,
	},
	sectionTitle: {
		fontWeight: "500",
		fontSize: 25,
		marginBottom: 10,
		paddingTop: 10,
	},
	productItem: {
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		marginBottom: 15,
		alignItems: "center",
		width: "100%",
	},
	productTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	productDescription: {
		fontSize: 14,
		marginVertical: 5,
		textAlign: "center",
	},
	productPrice: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 10,
	},
	productImage: {
		width: 150,
		height: 150,
		marginBottom: 10,
		borderRadius: 10,
	},
	middleContainer: {
		alignItems: "center",
	},
	businessDescriptionScroll: {
		width: "100%",
		marginTop: 10,
	},
	businessDescriptionText: {
		fontWeight: "500",
		width: "90%",
		marginHorizontal: "auto",
	},
	progressBars: {
		height: 13,
		marginTop: 2.3,
	},
	ratingNum: {
		color: "black",
		textAlign: "center",
		display: "flex",
		fontSize: 13,
	},
	bottomContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	carouselContainer: {
		height: 150,
		width: "100%",
	},
	carouselImage: {
		flex: 1,
		width: "100%",
	},
	contactInfo: {
		display: "flex",
		color: "black",
		marginTop: 15,
		flexDirection: "row",
	},
	contactText: {
		fontWeight: "500",
		textAlign: "center",
		width: "33%",
	},
	reviewContainer: {
		padding: 15,
		borderRadius: 20,
		backgroundColor: "#F9F9F9",
		shadowOffset: { width: -2, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		width: "85%",
		marginHorizontal: "auto",
	},
	inputContainer: {
		width: "100%",
		marginBottom: 15,
	},
	input: {
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		marginBottom: 10,
		width: "100%",
	},

	reviewUsername: {
		fontSize: 28,
		fontWeight: "300",
	},
	reviewText: {},
	ratingsContainer: {
		display: "flex",
		flexDirection: "row",
		marginTop: 15,
		marginHorizontal: "auto",
	},
	averageRatingText: {
		fontWeight: "300",
		fontSize: 50,
		textAlign: "center",
	},
	outOfText: {
		textAlign: "center",
	},
	starBarsContainer: {
		marginLeft: 10,
	},

	starRow: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 5,
	},
});

export default SpecificBusinessPage;
