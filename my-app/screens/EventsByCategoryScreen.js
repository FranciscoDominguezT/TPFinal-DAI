import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function EventsByCategoryScreen({ route, navigation }) {
  const { categoryId } = route.params;
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventsByCategory();
  }, [categoryId]);

  const fetchEventsByCategory = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('No se encontró el token');
        return;
      }

      const response = await axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/event?category=${categoryId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      setEvents(response.data.events || []); // Asegurar que siempre sea un array
    } catch (err) {
      setError(err.message);
      setEvents([]); // Establecer array vacío en caso de error
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>EVENTOS DE LA CATEGORÍA</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventText}>Evento número {item.id}</Text>
            <Text style={styles.eventText}>{item.name}</Text>
            <Text style={styles.eventText}>{new Date(item.start_date).toLocaleDateString()}</Text>
            <Button
              title="Ver detalles"
              onPress={() => {
                const eventDate = new Date(item.start_date);
                const isPastEvent = eventDate < new Date();
                navigation.navigate(isPastEvent ? 'EventDetailII' : 'EventDetail', { eventId: item.id });
              }}
            />
          </View>
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
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  eventText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
  },
});