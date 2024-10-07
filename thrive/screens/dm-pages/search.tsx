import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchResults: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState(data); // 'data' would be your list of results

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for businesses"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Feather name="search" size={24} color="#6B7280" style={styles.searchIcon} />
      </View>

      {/* Search Results */}
      <ScrollView style={styles.resultsList}>
        {filteredResults.length > 0 ? (
          filteredResults.map((item, index) => (
            <TouchableOpacity key={index} style={styles.resultItem}>
              <View style={styles.resultIconContainer}>
                <Text style={styles.resultIcon}>{item.initial}</Text>
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultDescription}>{item.description}</Text>
              </View>
              <Feather name="arrow-right" size={24} color="#6B7280" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>No results found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const data = [
  { name: 'Hyderabad Spice', description: 'Nice spicy Indian food', initial: 'H' },
  { name: 'Akbar’s Kitchen', description: 'Indian Food that takes you back', initial: 'A' },
  { name: 'Gupta Cuisine', description: 'Best Indian Food in NJ!', initial: 'G' },
  { name: 'Silicon Spice', description: 'Perfect for family and friends.', initial: 'S' },
  { name: 'Aangara Indian Cuisine', description: 'The Best Dosa in the Tri-state Area.', initial: 'A' },
  { name: 'Saffron Kitchen', description: 'Greatest Indian Food of All Time.', initial: 'S' }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  searchIcon: {
    marginLeft: 8,
  },
  resultsList: {
    flex: 1,
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  resultDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
  },
});

export default SearchResults;
