import React, {useState} from 'react';
import { View, Text, StyleSheet,  Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome } from '@expo/vector-icons';




const EditButton: React.FC = () => {
    const [opaque, setOpaque] = useState(false);
    return(
        <Pressable
            style={({ pressed }) => [
                styles.editButton,
                { opacity: pressed ? 0.5 : 1 }
            ]}
            onPressIn={() => setOpaque(true)}
            onPressOut={() => setOpaque(false)}
        >
            <Feather name="edit" size={32} color="#618BDB" />
            <Text style={styles.editButtonText}>Edit Home Page</Text>
        </Pressable>
    );
};

interface RatingStarProps{
    stars:number; 
}

const RatingStars: React.FC<RatingStarProps> = ( {stars} ) => {
    return (
        <View style={{flexDirection: 'row'}}>
            {Array.from({ length: 5 }, (_, index) => (
                index < stars 
                ? <FontAwesome key={index} name="star" size={32} color="orange"/>
                : <FontAwesome key={index} name="star-o" size={32} color="orange" />
            ))}
        </View>
    )
}

interface CompanyProps {
    name: string; 
    rating: number; 
    initial: string; 
    //orders: number; 
}

const CompanyHeader: React.FC<CompanyProps> = ({name, rating, initial}) => {
    return(
        <View style={styles.companyHeader}>
            <View style={styles.profileCircle}>
                <Text style={styles.initialText}>{initial}</Text>
            </View>
            <View style={styles.headerTextContainer}>
                <Text style={styles.companyHeaderNameText}>{name}</Text>
                <RatingStars stars={rating}/>
            </View>
        </View>
    );
};

interface OrderProps {
    orders: number 
}

const OrdersBox: React.FC<OrderProps> = ({ orders }) => {
    const [opaque, setOpaque] = useState(false);
    return (
        <View style={styles.ordersBoxContainer}>
            <View style={styles.ordersContainer}>
            <View style={{ flexDirection: 'row' }}>
                <Text style = {styles.ordersNumberText}>{orders}</Text>
                <Text style={styles.ordersText}> new orders</Text>
            </View>
                <Pressable 
                    style={({ pressed }) => [
                    styles.fulfillOrdersButton,
                    { opacity: pressed ? 0.5 : 1 }
                    ]}
                    onPressIn={() => setOpaque(true)}
                    onPressOut={() => setOpaque(false)}
                >
                    <Text style={styles.fulfillOrdersText}>Fulfill Orders</Text>
                </Pressable>
            </View>
        </View>
    );
};

const AIInsights: React.FC = ()  => {
    return (
        <View style={styles.insightContainer}>
            <Text style={styles.insightTitle}>AI Insights</Text>

            <View style={styles.insightItem}>
                <Text style={styles.insightNumber}>1.</Text>
                <Text style={styles.insightText}>You can lower the price of your Gobhi Manchurian from $5 to $4. This would entice more customers to try this lovely treat!</Text>
            </View>

            <View style={styles.insightItem}>
                <Text style={styles.insightNumber}>2.</Text>
                <Text style={styles.insightText}>You misspelled one of the items on your menu saying “paner” instead of the correct “paneer.”</Text>
            </View>

            <Text style={styles.insightNumber}>Here are a few competing businesses:</Text>

            <View style={styles.insightItem}>
                <Text style={styles.insightNumber}>1.</Text>
                <Text style={styles.insightText}>Akbar's Kitchen</Text>
            </View>
        </View>
    )
}



const LandingPageBusiness: React.FC = () => {
    return(
        <View>
            <EditButton/> 
            <CompanyHeader name="Hyderabad Spice" rating={4} initial="H"/>
            <OrdersBox orders={3}/>
            <AIInsights/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E4E8EE',
        flexDirection: 'column',
    },
    editButton: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        margin: 0,
        marginTop: 10,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
    },
    editButtonText: {
        color: '#618BDB',
        fontSize: 30,
        fontWeight: 'bold',
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
        height: 175,
        width: '100%',
    },
    headerTextContainer: {
        flexDirection: 'column',
        marginLeft: 20,
        marginTop: 12,
    },
    companyHeaderNameText: {
        color: 'black',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    profileCircle: {
        backgroundColor: '#8B5CF6',
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    initialText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    ordersBoxContainer: {
        backgroundColor: '#FFFFFF', // White box around the content
        borderRadius: 0,
        padding: 20,
        marginTop: 20,
        width: '100%', // Ensure the box takes full width
    },
    ordersContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    ordersText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15
    },
    ordersNumberText:{
        fontSize:45,
        fontWeight: 'bold'
    },
    fulfillOrdersButton: {
        backgroundColor: '#8B5CF6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    fulfillOrdersText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    insightTitle: {
        fontSize: 45,
        textAlign: 'center',
        marginBottom: 20
    },
    insightText: {
        fontSize: 15,
        fontWeight: 'bold',
        maxWidth: '95%'

    },
    insightContainer: {
        backgroundColor: 'white',
        marginTop: 20,
        justifyContent: 'center',
        width: '100%'

    },
    insightItem: {
        flexDirection: 'row', // Align number and text in a row
        alignItems: 'flex-start', // Align text to the start vertically
        marginBottom: 5, // Add some space between items
    },
    insightNumber: {
        fontWeight: 'bold',
        marginRight: 5, // Space between the number and the text
        marginLeft: 5
    },
});

export default LandingPageBusiness;
