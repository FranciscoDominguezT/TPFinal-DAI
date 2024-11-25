import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('No se encontró el token');
        return;
      }

      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/event-category', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('EventsByCategoryScreen', { categoryId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CATEGORÍAS</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item.id)}>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: '#cfc0fe',
    padding: 16,
    marginTop: 40,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  categoryItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginVertical: 6,
  },
  categoryText: {
    fontSize: 18,
    textAlign: 'center',
  },
});