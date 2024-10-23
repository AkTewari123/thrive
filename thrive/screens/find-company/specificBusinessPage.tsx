import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import {
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	SafeAreaView,
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
import { doc, getDoc } from "firebase/firestore";
import { query, where, getDocs, collection } from "firebase/firestore";
import { FIRESTORE } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import BusinessNavBar from "../components/businessNavbar";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: Encountered two children with the same key']);

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

	useEffect(() => {
		const fetchBusinessData = async () => {
			setLoading(true);
			try {
				const q = query(
					collection(FIRESTORE, "businessData"),
					where("businessID", "==", id) // 'id' here should be the businessID you are searching for
				);

				const querySnapshot = await getDocs(q);

				if (!querySnapshot.empty) {
					// Assuming there's only one document per businessID
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

		fetchBusinessData();
	}, [id]);

	const navigation = useNavigation();

	const businessName = businessData?.businessName || "Not defined";
	const businessDescription = businessData?.description || "Not defined";
	const phoneNumber = businessData?.phoneNumber || "Not defined";
	const address = businessData?.location || "Not defined";
	const schedule = businessData?.schedule || {};
	const images = businessData?.images || [
		"https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		"https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		"https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
	];
	const reviews = businessData?.reviews || [
		{ username: "None", rating: null, review: "No Reviews" },
	];

	useEffect(() => {
		if (businessData) {
			navigation.setOptions({
				headerTitle: businessName, // Sets the business name as title after it's loaded
				headerBackTitle: "Back", // Shows "Back" next to the back button
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
		}, 10000); // Update every 10 seconds

		return () => clearInterval(interval); // Clear the interval when component unmounts
	}, [reviews.length]);

	let displayDate: string = "0";
	let tdy = format(new Date(), "iiii");
	if (schedule[tdy]) {
		displayDate = `${schedule[tdy][0]}-${schedule[tdy][1]}`;
	}

	const starHollowed = Array.from({ length: 5 }, (_, i) =>
		i < numStars ? "star" : "star-o"
	);

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

				<View style={[styles.childContainer, styles.middleContainer]}>
					<Text style={styles.sectionTitle}>Ratings & Reviews</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							marginTop: 15,
							marginHorizontal: "auto",
						}}
					>
						<View>
							<Text
								style={{
									fontWeight: 300,
									fontSize: 50,
									textAlign: "center",
								}}
							>
								4.3
							</Text>
							<Text style={{ textAlign: "center" }}>
								out of 5 stars
							</Text>
						</View>
						<View style={{ marginLeft: 10 }}>
							<Text>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
							</Text>
							<Text>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
							</Text>
							<Text>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
							</Text>
							<Text>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
							</Text>
							<Text>
								<FontAwesome
									name="star"
									size={15}
									color="black"
								/>
							</Text>
						</View>
						<View style={{ marginHorizontal: 5 }}>
							<Text style={styles.ratingNum}>(89)</Text>
							<Text style={styles.ratingNum}>(34)</Text>
							<Text style={styles.ratingNum}>(12)</Text>
							<Text style={styles.ratingNum}>(2)</Text>
							<Text style={styles.ratingNum}>(19)</Text>
						</View>
						<View style={{ marginLeft: 5, width: scale * 10 }}>
							<ProgressBar
								progress={55}
								progressColor="#1415D0"
								style={{ height: 13 }}
							/>
							<ProgressBar
								progress={20}
								progressColor="#1415D0"
								style={styles.progressBars}
							/>
							<ProgressBar
								progress={10}
								progressColor="#1415D0"
								style={styles.progressBars}
							/>
							<ProgressBar
								progress={2}
								progressColor="#1415D0"
								style={styles.progressBars}
							/>
							<ProgressBar
								progress={30}
								progressColor="#1415D0"
								style={styles.progressBars}
							/>
							<Progress.Bar
								progress={0.2}
								borderRadius={30}
								color="transparent"
							/>
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
	topContainer: {},
	middleContainer: {
		alignItems: "center",
	},
	bottomContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	businessInfoContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	progressBars: {
		height: 13,
		marginTop: 2.3,
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
	ratingNum: {
		color: "black",
		textAlign: "center",
		display: "flex",
		fontSize: 13,
	},
	businessDetails: {
		marginLeft: 15,
	},
	businessName: {
		fontWeight: "500",
		fontSize: 30,
	},
	businessDescription: {
		fontWeight: "500",
		color: "grey",
		fontSize: 15,
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
	sectionTitle: {
		fontWeight: "500",
		fontSize: 25,
		marginBottom: 10,
		paddingTop: 10,
	},
	carouselContainer: {
		height: 150,
		width: "100%",
	},
	carouselImage: {
		flex: 1,
		width: "100%",
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
});
export default SpecificBusinessPage;
