import React, { useEffect, useState, useCallback } from "react";
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, View, Image } from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, setDoc } from "firebase/firestore"; 
import { FIRESTORE, FIREBASE_AUTH } from "../../FirebaseConfig";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Consistent color palette matching login page
const COLORS = {
    primary: "#6366F1",
    secondary: "#4F46E5",
    background: "#F3F4F6",
    surface: "#FFFFFF",
    text: {
        primary: "#1F2937",
        secondary: "#6B7280",
        inverse: "#FFFFFF",
    },
    border: "#E5E7EB",
    success: "#10B981",
};

const BusinessOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { id } = route.params as { id: string };
    const navigation = useNavigation();
    
    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Orders Dashboard",
            headerBackTitle: "Back",
            headerStyle: {
                backgroundColor: COLORS.surface,
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: {
                fontWeight: "600",
            },
        });
    }, [navigation]);

    const fetchOrders = async () => {
        try {
            const q = query(collection(FIRESTORE, "businessData"), where("businessID", "==", id));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const businessDoc = querySnapshot.docs[0];
                const data = businessDoc.data();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error("Error fetching orders: ", error);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [id])
    );

    const currentUserEmail: any = FIREBASE_AUTH.currentUser?.email;

    const handleSendMessage = async (recipientEmail: string, orderId: string, orderName: string) => {
        const docId = currentUserEmail && recipientEmail
            ? [currentUserEmail, recipientEmail].sort().join("&")
            : null;
        const docRef = doc(FIRESTORE, "messages", docId || "default");
        const messageContent = `Your order for ${orderName} is ready for pickup!`;
        const newMessage = { [currentUserEmail]: messageContent };

        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    chat: [...(docSnap.data().chat || []), newMessage],
                });
            } else {
                await setDoc(docRef, {
                    chat: [newMessage],
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const setFulfillStatus = async (orderId: string): Promise<any[]> => {
        try {
            const q = query(collection(FIRESTORE, "businessData"), where("businessID", "==", id));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                const updatedOrders = orders.map((order) => {
                    if (order.id === orderId) {
                        return { ...order, fulfilled: true };
                    }
                    return order;
                });
                await updateDoc(docRef, { orders: updatedOrders });
                return updatedOrders;
            }
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
        return orders;
    };

    const handleFulfill = async (orderId: string, userEmail: string, orderName: string) => {
        await handleSendMessage(userEmail, orderId, orderName);
        const updatedOrders = await setFulfillStatus(orderId);
        setOrders(updatedOrders.filter(order => !order.fulfilled));
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <MaterialCommunityIcons
                        name="shopping"
                        size={40}
                        color={COLORS.primary}
                    />
                    <Text style={styles.headerTitle}>Pending Orders</Text>
                    <Text style={styles.subtitle}>Manage your customer orders</Text>
                </View>

                <View style={styles.ordersContainer}>
                    {orders.length > 0 ? (
                        orders
                            .filter((order: any) => !order.fulfilled)
                            .map((order: any, index: number) => (
                                <View key={index} style={styles.orderCard}>
                                    <Image source={{ uri: order.productImage }} style={styles.orderImage} />
                                    <View style={styles.orderDetails}>
                                        <Text style={styles.orderTitle}>{order.productName}</Text>
                                        <Text style={styles.orderPrice}>${order.productPrice}</Text>
                                        <Text style={styles.orderEmail}>{order.userId}</Text>
                                        <Text style={styles.orderTime}>
                                            {format(order.timestamp.toDate(), 'PPpp')}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.fulfillButton}
                                            onPress={() => handleFulfill(order.id, order.userId, order.productName)}
                                        >
                                            <MaterialCommunityIcons
                                                name="check-circle"
                                                size={24}
                                                color={COLORS.text.inverse}
                                            />
                                            <Text style={styles.fulfillButtonText}>Mark as Fulfilled</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <MaterialCommunityIcons
                                name="package-variant"
                                size={64}
                                color={COLORS.text.secondary}
                            />
                            <Text style={styles.emptyStateText}>No pending orders</Text>
                        </View>
                    )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        alignItems: "center",
        padding: 24,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.text.primary,
        marginTop: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text.secondary,
        marginTop: 4,
    },
    ordersContainer: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    orderImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    orderDetails: {
        padding: 16,
    },
    orderTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    orderPrice: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.primary,
        marginBottom: 8,
    },
    orderEmail: {
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: 4,
    },
    orderTime: {
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: 16,
    },
    fulfillButton: {
        backgroundColor: COLORS.success,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    fulfillButtonText: {
        color: COLORS.text.inverse,
        fontSize: 16,
        fontWeight: "600",
    },
    emptyStateContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginTop: 16,
    },
    emptyStateText: {
        fontSize: 18,
        color: COLORS.text.secondary,
        marginTop: 16,
        fontWeight: "500",
    },
});

export default BusinessOrdersPage;