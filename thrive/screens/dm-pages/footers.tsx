import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from "@expo/vector-icons/Feather";

export const BusinessFooter: React.FC = () => {
  const [selectedChoice, setSelectedChoice] = useState(0);

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerItem} onPress={() => setSelectedChoice(0)}>
        <Feather name="send" size={34} color={selectedChoice === 0 ? '#618BDB' : '#000'} />
        <Text style={[styles.iconText, { color: selectedChoice === 0 ? '#618BDB' : '#000' }]}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={() => setSelectedChoice(1)}>
        <Feather name="home" size={34} color={selectedChoice === 1 ? '#618BDB' : '#000'} />
        <Text style={[styles.iconText, { color: selectedChoice === 1 ? '#618BDB' : '#000' }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={() => setSelectedChoice(2)}>
        <Feather name="briefcase" size={34} color={selectedChoice === 2 ? '#618BDB' : '#000'} />
        <Text style={[styles.iconText, { color: selectedChoice === 2 ? '#618BDB' : '#000' }]}>Explore</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: '#ddd',
  },
  footerItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconText: {
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
});
