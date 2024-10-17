import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

interface BusinessDetails {
    businessName: string;
    location: string;
    establishmentDate: string;
    services: string;
    menuPdf: any;
}

const BusinessSignUpPage: React.FC = ({ navigation }) => {
    const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
        businessName: '',
        location: '',
        establishmentDate: '',
        services: '',
        menuPdf: null,
    });

    const handleInputChange = (name: keyof BusinessDetails, value: string) => {
        setBusinessDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSignUp = () => {
        // Handle sign-up logic here
        console.log('Business details:', businessDetails);
        // Navigate to next page or show confirmation
        // navigation.navigate('ConfirmationPage');
    };

    const handlePdfUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

            if (!result.canceled) {
                setBusinessDetails(prevState => ({
                    ...prevState,
                    menuPdf: result,
                }));
            }

        } catch (err) {
            console.error('Error picking document:', err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Business Sign-Up</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Business Name"
                    value={businessDetails.businessName}
                    onChangeText={(value) => handleInputChange('businessName', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={businessDetails.location}
                    onChangeText={(value) => handleInputChange('location', value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Date of Establishment"
                    value={businessDetails.establishmentDate}
                    onChangeText={(value) => handleInputChange('establishmentDate', value)}
                />

                <TouchableOpacity style={styles.uploadButton} onPress={handlePdfUpload}>
                    <FontAwesome name="file-pdf-o" size={24} color="#6366F1" />
                    <Text style={styles.uploadButtonText}>
                        {businessDetails.menuPdf ? 'Change Menu/Product List PDF' : 'Upload Menu/Product List PDF'}
                    </Text>
                </TouchableOpacity>
                {businessDetails.menuPdf && !businessDetails.menuPdf.canceled && (
                    <Text style={styles.fileName}>{businessDetails.menuPdf.assets[0].name}</Text>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        padding: 32,
        borderRadius: 10,
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E7FF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 4,
    },
    uploadButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#6366F1',
    },
    fileName: {
        fontSize: 14,
        color: '#6366F1',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#6366F1',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 32,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BusinessSignUpPage;