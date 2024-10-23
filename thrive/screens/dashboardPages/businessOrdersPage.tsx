import React, { useEffect, useState, useCallback } from "react";
import { Text, StyleSheet, SafeAreaView, Button, ActivityIndicator, ScrollView, View, Image } from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"; 
import { FIRESTORE } from "../../FirebaseConfig";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { getDoc, setDoc } from "firebase/firestore";

const BusinessOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { id } = route.params as { id: string };

    const fetchOrders = async () => {
        try {
            const q = query(collection(FIRESTORE, "businessData"), where("businessID", "==", id));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const businessDoc = querySnapshot.docs[0];
                const data = businessDoc.data();
                setOrders(data.orders || []); // Assuming orders are stored under 'orders' field
            } else {
                console.log("No such business found with the given ID");
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

    const currentUserEmail:any = FIREBASE_AUTH.currentUser?.email;

    const handleSendMessage = async (recipientEmail: string, orderId: string) => {
        const docId =
            currentUserEmail && recipientEmail
                ? [currentUserEmail, recipientEmail].sort().join("&")
                : null;
        const docRef = doc(FIRESTORE, "messages", docId || "default");

        const messageContent = `Your order ${orderId} is ready for pickup!`;

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
            } else {
                console.log("No such business found with the given ID.");
            }
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
        return orders; // Return current orders if error occurs
    };
    

    const handleFulfill = async (orderId: string, userEmail: string) => {
        alert(`Order ${orderId} fulfilled!`);
        await handleSendMessage(userEmail, orderId);
        const updatedOrders = await setFulfillStatus(orderId);
    
        // Update the orders state after fulfilling
        setOrders(updatedOrders.filter(order => !order.fulfilled)); // Remove fulfilled orders from the list
    };
    

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }


    return (
        <ScrollView style={styles.pageContainer}>
            <View style={[styles.childContainer, styles.middleContainer]}>
                <Text style={styles.sectionTitle}>Orders</Text>
                {orders.length > 0 ? (
                    orders
                        .filter((order: any) => !order.fulfilled) // Only render orders that are not fulfilled
                        .map((order: any, index: any) => (
                            <View key={index} style={styles.orderItem}>
                                <Text style={styles.orderTitle}>{order.productName}</Text>
                                <Image source={{ uri: order.productImage }} style={styles.orderImage} />
                                <Text style={styles.orderDescription}>Price: ${order.productPrice}</Text>
                                <Text style={styles.orderDescription}>Order Email: {order.userId}</Text>
                                <Text style={styles.orderDescription}>Timestamp: {format(order.timestamp.toDate(), 'PPpp')}</Text>
                                <Button title="Fulfill" onPress={() => handleFulfill(order.id, order.userId)} />
                            </View>
                        ))
                ) : (
                    <Text>No orders available</Text>
                )}
            </View>
        </ScrollView>
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
    middleContainer: {
        alignItems: "center",
    },
    sectionTitle: {
        fontWeight: "500",
        fontSize: 25,
        marginBottom: 10,
        paddingTop: 10,
    },
    orderItem: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        alignItems: "center",
        width: "100%",
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    orderDescription: {
        fontSize: 14,
        marginVertical: 5,
        textAlign: "center",
    },
    orderImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
        borderRadius: 10,
    },
});

export default BusinessOrdersPage;
