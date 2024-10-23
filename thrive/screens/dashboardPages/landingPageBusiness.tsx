import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE, FIREBASE_AUTH } from '../../FirebaseConfig';
import thriveHeader from '../components/thriveHeader';

const EditButton: React.FC = () => (
    <Pressable style={styles.editButton}>
        <Feather name="edit-2" size={20} color="#618BDB" />
        <Text style={styles.editButtonText}>Edit Home Page</Text>
    </Pressable>
);

interface RatingStarProps { stars: number; }

export const RatingStars: React.FC<RatingStarProps> = ({ stars }) => (
    <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }, (_, index) => (
            <FontAwesome key={index} name={index < stars ? "star" : "star-o"} size={16} color="#FFD700" />
        ))}
        <Text style={styles.ratingText}>{stars.toFixed(1)}</Text>
    </View>
);

interface CompanyProps { name: string; rating: number; initial: string; }

const CompanyHeader: React.FC<CompanyProps> = ({ name, rating, initial }) => (
    <View style={styles.companyHeader}>
        <View style={styles.profileCircle}>
            <Text style={styles.initialText}>{initial}</Text>
        </View>
        <View style={styles.headerTextContainer}>
            <Text style={styles.companyHeaderNameText}>{name}</Text>
            <RatingStars stars={rating} />
        </View>
    </View>
);

interface OrderProps { orders: number }

const OrdersBox: React.FC<OrderProps> = ({ orders }) => (
    <View style={styles.ordersBoxContainer}>
        <View style={styles.ordersInfo}>
            <Text style={styles.ordersNumberText}>{orders}</Text>
            <Text style={styles.ordersText}>New Orders</Text>
        </View>
        <Pressable style={styles.fulfillOrdersButton}>
            <Text style={styles.fulfillOrdersText}>Fulfill Orders</Text>
        </Pressable>
    </View>
);

const AIInsights: React.FC = () => (
    <View style={styles.insightContainer}>
        <Text style={styles.insightTitle}>AI Insights</Text>
        <View style={styles.insightItem}>
            <Text style={styles.insightNumber}>1.</Text>
            <Text style={styles.insightText}>Lower the price of Gobhi Manchurian from $5 to $4 to entice more customers.</Text>
        </View>
        <View style={styles.insightItem}>
            <Text style={styles.insightNumber}>2.</Text>
            <Text style={styles.insightText}>Correct the menu spelling from "paner" to "paneer".</Text>
        </View>
        <Text style={styles.insightSubtitle}>Competing businesses:</Text>
        <View style={styles.insightItem}>
            <Text style={styles.insightNumber}>1.</Text>
            <Text style={styles.insightText}>Akbar's Kitchen</Text>
        </View>
    </View>
);

interface BusinessData {
    businessName: string;
    location: string;
    establishmentDate: string;
    services: string;
    phoneNumber: string;
}

const LandingPageBusiness: React.FC = () => {
    const [businessData, setBusinessData] = useState<BusinessData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {   
                const user = FIREBASE_AUTH.currentUser;
                if (user) {
                    const docRef = doc(FIRESTORE, 'businessData', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setBusinessData(docSnap.data() as BusinessData);
                    }
                }
            } catch (error) {
                console.error("Error fetching business data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                {thriveHeader({})}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5A5D9D" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {thriveHeader({})}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <CompanyHeader 
                    name={businessData?.businessName || "Business Name"} 
                    rating={4} 
                    initial={businessData?.businessName?.[0] || "B"} 
                />
                <View style={styles.contentContainer}>
                    <EditButton />
                    <OrdersBox orders={3} />
                    <View style={styles.businessInfoContainer}>
                        <Text style={styles.sectionTitle}>Business Information</Text>
                        <Text style={styles.infoText}>Location: {businessData?.location}</Text>
                        <Text style={styles.infoText}>Established: {businessData?.establishmentDate}</Text>
                        <Text style={styles.infoText}>Services: {businessData?.services}</Text>
                        <Text style={styles.infoText}>Phone: {businessData?.phoneNumber}</Text>
                    </View>
                    <AIInsights />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    scrollContent: {
        flexGrow: 1,
    },
    contentContainer: {
        padding: 16,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    editButtonText: {
        color: '#618BDB',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    companyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5A5D9D',
        padding: 20,
    },
    profileCircle: {
        backgroundColor: '#FFFFFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        color: '#8B5CF6',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTextContainer: {
        marginLeft: 16,
    },
    companyHeaderNameText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: '#FFFFFF',
        marginLeft: 4,
        fontSize: 14,
    },
    ordersBoxContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ordersInfo: {
        flexDirection: 'column',
    },
    ordersNumberText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#5A5D9D',
    },
    ordersText: {
        fontSize: 14,
        color: '#4B5563',
    },
    fulfillOrdersButton: {
        backgroundColor: '#5A5D9D',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    fulfillOrdersText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    insightContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    insightTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1F2937',
    },
    insightSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        color: '#4B5563',
    },
    insightItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    insightNumber: {
        fontWeight: 'bold',
        marginRight: 8,
        color: '#8B5CF6',
    },
    insightText: {
        fontSize: 14,
        color: '#4B5563',
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    businessInfoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1F2937',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#4B5563',
    },
});

export default LandingPageBusiness;