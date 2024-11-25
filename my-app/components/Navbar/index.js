import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asumiendo que estás usando Expo
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
};

  return (
    <View style={styles.navbar}>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigation.navigate('Events')}
        >
        <Ionicons name="calendar-outline" size={24} color="black" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="search-outline" size={24} color="black" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-outline" size={24} color="black" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={handleLogout}
        >
        <Ionicons name="log-out-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

export default Navbar;