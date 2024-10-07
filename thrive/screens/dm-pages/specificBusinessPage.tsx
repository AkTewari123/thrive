import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { RatingStars } from './landingPageBusiness';
import { FontAwesome } from '@expo/vector-icons';

interface CompanyProps {
    name: string; 
    rating: number; 
    initial: string; 
    phoneNumber: string;
    address: string;
    timeStart: string; 
    timeEnd: string; 
}

const CompanyHeader: React.FC<CompanyProps> = ({name, rating, initial, phoneNumber, address, timeStart, timeEnd}) => {
    return(
        <View style={styles.companyHeader}>
            <View style={styles.profileCircle}>
                <Text style={styles.initialText}>{initial}</Text>
            </View>
            <View style={styles.headerTextContainer}>
                <Text style={styles.companyHeaderNameText}>{name}</Text>
                <RatingStars stars={rating}/>
            </View>

            {/* Divide icons vertically */}
            <View style = {styles.informationContainer}>                                                  
                <View style={styles.information}>
                    <Feather name="phone-call" size={24} color="#C2C0C0" style={styles.informationIcon} />
                    <Text style={styles.informationText}>{phoneNumber}</Text>
                </View>
                <View style={styles.information}>
                    <Feather name="map-pin" size={24}  color="#C2C0C0" style={styles.informationIcon}  />
                    <Text style={styles.informationText}>{address}</Text>
                </View>
                <View style={styles.information}>
                    <Feather name="clock" size={24} color="#C2C0C0" style={styles.informationIcon}  />
                    <Text style={styles.informationText}>{timeStart + ' - ' + timeEnd}</Text>
                </View>
            </View>
        </View>
    );
};

const DescriptionBox: React.FC = () => {

    const images = [
        require('./images/example1.png'),
        require('./images/example2.png')
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [opaque, setOpaque] = useState(false);

    const switchImageNext = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    };
    const switchImagePrev = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
    };

    return(
        <View style={styles.descriptionBox}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <View style={styles.imageBox}>
                <Image style = {styles.image} source={images[currentIndex]}/>
                
            </View>
            <View>
                <Pressable 
                        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }, styles.button]}
                        onPress={switchImagePrev}
                >
                        <FontAwesome  name="caret-left" size={32} color="#D9D9D9" />
                </Pressable>
                <Pressable 
                        onPress={switchImageNext}
                >
                    <FontAwesome  name="caret-right" size={32} color="#D9D9D9" />
                </Pressable>
            </View>
        </View>
    )
}



const LandingPageBusiness: React.FC = () => {
    return(
        <View>
            <CompanyHeader name="Hyderabad Spice" rating={4} initial="H" phoneNumber="111-222-3333" address="40 Edgerow Lane" timeStart="9:00 AM" timeEnd="5:00 PM"/>
            <DescriptionBox></DescriptionBox>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E4E8EE',
        flexDirection: 'column',
    },
    companyHeader: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        margin: 0,
        marginTop: 25,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'flex-start',
        marginLeft: -15, 
 
        width: '110%',
    },
    headerTextContainer: {
        flexDirection: 'column',
        marginLeft: 5,
    },
    companyHeaderNameText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    profileCircle: {
        backgroundColor: '#8B5CF6',
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    initialText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    informationContainer: {
        flexDirection: 'column',
    }, 
    informationIcon: {
        marginBottom: 5,
    }, 
    information: {
        flexDirection: 'row',
        justifyContent: 'flex-start', 
    }, 
    informationText: {
        marginLeft: 5,
        marginTop: 3,
        color: "#C2C0C0",
        fontSize: 12,
        fontWeight: 'bold'
    },
    descriptionBox: {
        backgroundColor: 'white',
        marginTop: 30,
        flexDirection: 'column'
    },
    descriptionTitle: {
        fontWeight: 'bold',
        fontSize: 40,
        marginLeft: 25
    },
    imageBox: {
        borderWidth: 5,
        width: 200, 
        height: 200,
        overflow: 'hidden'
    },

    image: {
        width: '100%',
        height: '100%'
    },

    button: {

    }


});

export default LandingPageBusiness;

