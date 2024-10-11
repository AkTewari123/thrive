import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Text, StyleSheet, Dimensions } from "react-native";
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
          width: "95%",
          marginHorizontal: "auto",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 700,
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

interface SpecificBusinessItemProps {
  businessName: string;
  businessDescription: string;
  numStars: number;
  phoneNumber: string;
  address: string;
  schedule: { [key: string]: [string, string] };
}

const SpecificBusinessPage: React.FC = () => {
  const route = useRoute();
  const { width } = Dimensions.get("window");
  let scale = width / 35;
  const IMAGES = [
    "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2529159/pexels-photo-2529159.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2529158/pexels-photo-2529158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  ];

  const {
    businessName,
    businessDescription,
    numStars,
    phoneNumber,
    address,
    schedule,
  } = route.params as SpecificBusinessItemProps;

  let displayDate: string = "0";
  let tdy = format(new Date(), "iiii");
  for (let i = 0; i < Object.keys(schedule).length; i++) {
    if (Object.keys(schedule)[i] === tdy) {
      displayDate = `${Object.values(schedule)[i][0]}-${
        Object.values(schedule)[i][1]
      }`;
    }
  }

  const starHollowed = Array.from({ length: 5 }, (_, i) =>
    i < numStars ? "star" : "star-o"
  );

  return (
    <>
      <ScrollView style={styles.pageContainer}>
        {thriveHeader({})}
        <View style={[styles.childContainer, styles.topContainer]}>
          <View style={styles.businessInfoContainer}>
            <View
              style={[styles.initialCircle, { backgroundColor: "#6096F7" }]}
            >
              <Text style={styles.initialText}>{businessName.slice(0, 1)}</Text>
            </View>
            <View style={styles.businessDetails}>
              <Text style={styles.businessName}>{businessName}</Text>
              <Text style={styles.businessDescription}>
                {businessDescription}
              </Text>
              <Text>
                {starHollowed.map((star, index) => (
                  <FontAwesome
                    key={index}
                    name={star}
                    size={15}
                    color="black"
                  />
                ))}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.childContainer}>
          <Text style={[{ textAlign: "center" }, styles.sectionTitle]}>
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
            Our Business
          </Text>
          <Carousel
            containerStyle={styles.carouselContainer}
            loop
            pageControlPosition={Carousel.pageControlPositions.OVER}
            showCounter
            autoplay
          >
            {IMAGES.map((image, index) => (
              <View flex centerV key={index}>
                <Image
                  overlayType={Image.overlayTypes.BOTTOM}
                  style={styles.carouselImage}
                  source={{ uri: image }}
                  resizeMode="cover"
                  borderRadius={30}
                />
              </View>
            ))}
          </Carousel>
          <ScrollView style={styles.businessDescriptionScroll}>
            <Text style={styles.businessDescriptionText}>
              &nbsp; &nbsp; &nbsp; I was with Kendrick Lamar back in Compton,
              USA. You know how hard it is to make it here? It's very hard, just
              so you know. It's important to keep an open mind since anything is
              possible blah blah blahblah blah blahblah blah blahblah blah
              blahblah blah blahblah blah blah
            </Text>
          </ScrollView>
        </View>
        <View style={[styles.childContainer]}>
          <Text
            style={{
              fontWeight: 800,
              fontSize: 35,
              textAlign: "center",
            }}
          >
            Ratings & Reviews
          </Text>
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
                  fontWeight: 800,
                  fontSize: 50,
                  textAlign: "center",
                }}
              >
                4.3
              </Text>
              <Text style={{ textAlign: "center" }}>out of 5 stars</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text>
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
              </Text>
              <Text>
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
              </Text>
              <Text>
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
              </Text>
              <Text>
                <FontAwesome name="star" size={15} color="black" />
                <FontAwesome name="star" size={15} color="black" />
              </Text>
              <Text>
                <FontAwesome name="star" size={15} color="black" />
              </Text>
            </View>
            <View style={{ marginHorizontal: 5 }}>
              <Text style={styles.ratingNum}>(89)</Text>
              <Text style={styles.ratingNum}>(34)</Text>
              <Text style={styles.ratingNum}>(2)</Text>
              <Text style={styles.ratingNum}>(12)</Text>
              <Text style={styles.ratingNum}>(1)</Text>
            </View>
            <View style={{ marginLeft: 5, width: scale * 10 }}>
              <ProgressBar
                progress={55}
                progressColor="#1415D0"
                style={{ height: 13 }}
              />
              <ProgressBar
                progress={10}
                progressColor="#1415D0"
                style={styles.progressBars}
              />
              <ProgressBar
                progress={10}
                progressColor="#1415D0"
                style={styles.progressBars}
              />
              <ProgressBar
                progress={2 / 0.75}
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
        <View style={[styles.childContainer]}>
          <Text
            style={{
              fontWeight: 800,
              fontSize: 35,
              textAlign: "center",
            }}
          >
            Customers
          </Text>
          <Review
            username="rtenacity"
            rating={4}
            review="good product, overall W"
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 25,
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
    fontWeight: "700",
  },
  ratingNum: {
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    display: "flex",
    fontSize: 13,
  },
  businessDetails: {
    marginLeft: 15,
  },
  businessName: {
    fontWeight: "700",
    fontSize: 21,
  },
  businessDescription: {
    fontWeight: "800",
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
    fontWeight: "300",
    textAlign: "center",
    width: "33%",
  },
  sectionTitle: {
    fontWeight: "800",
    fontSize: 35,
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
    maxHeight: 100,
    width: "100%",
    marginTop: 10,
  },
  businessDescriptionText: {
    fontWeight: "700",
    width: "90%",
    marginHorizontal: "auto",
  },
});
export default SpecificBusinessPage;
