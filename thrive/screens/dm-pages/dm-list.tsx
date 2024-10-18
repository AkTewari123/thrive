import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import thriveHeader from "../components/thriveHeader";
import { useNavigation } from '@react-navigation/native'
import SpecificDM from './dm';
import BusinessNavBar from '../components/businessNavbar';

interface BusinessItemProps {
  name: string;
  description: string;
  initial: string;
}

const BusinessItem: React.FC<BusinessItemProps> = ({ name, description, initial }) => (
  <TouchableOpacity style={styles.itemContainer}>
    <View style={[styles.initialCircle, { backgroundColor: initial === 'H' ? '#8B5CF6' : '#22C55E' }]}>
      <Text style={styles.initialText}>{initial}</Text>
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
    </View>
    <Text style={styles.arrowRight}><Feather name="arrow-right-circle" size={32} color='black' /></Text>
  </TouchableOpacity>
);

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const SeeMoreButton: React.FC = () => (
  <TouchableOpacity style={styles.seeMoreButton}>
    <Text style={styles.seeMoreText}>See More</Text>
    <Feather name="arrow-down-circle" size={32} color='#3B82F6' />
  </TouchableOpacity>
);

const FloatingActionButton: React.FC = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('SpecificDM' as never);
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <View style={styles.fabIconContainer}>
        <Feather name="message-square" size={24} color="white" />
      </View>
      <Text style={styles.fabText}>New Chat</Text>
    </TouchableOpacity>
  );
};

const DMList: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {thriveHeader({})}

      <ScrollView style={styles.content}>
        <SectionHeader title="Businesses" />
        <BusinessItem name="Hyderabad Spice" description="Yes, we have Paneer." initial="H" />
        <BusinessItem name="Ganga" description="Happy hour is 5-6pm." initial="G" />
        <SeeMoreButton />

        <SectionHeader title="Other Customers" />
        <BusinessItem name="Henry Bagdasarov" description="Can I ask what was so good?" initial="H" />
        <BusinessItem name="Gestapo" description="How's the sushi?" initial="G" />
        <SeeMoreButton />
      </ScrollView>

      <FloatingActionButton />
      <BusinessNavBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E8EE',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Adjust this value to move it above the navbar
    backgroundColor: '#5A5D9D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIconContainer: {
    marginRight: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrowRight: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  seeMoreButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    padding: 2,
  },
  seeMoreText: {
    color: '#3B82F6',
    fontSize: 16,
  },
  startChatButton: {
    backgroundColor: '#5A5D9D',
    margin: 16,
    padding: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startChatIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  startChatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DMList;
