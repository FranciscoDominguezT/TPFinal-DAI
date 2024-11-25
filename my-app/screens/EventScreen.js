import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function EventScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setError('No se encontró el token');
          return;
        }

        const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/event', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(response.data.events);
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.loginA}>
        <Text style={styles.loginText}>EVENTO</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => {
          // console.log('Evento renderizado:', item); 
          return (
            <View style={styles.eventItem}>
              <Text style={styles.eventText}>Evento número {item.id}</Text>
              <Text style={styles.eventText}>{item.name}</Text>
              <Text style={styles.eventText}>{new Date(item.start_date).toLocaleDateString()}</Text>
              <Button 
                title="Ver detalles" 
                onPress={() => {
                  const eventDate = new Date(item.start_date);
                  const isPastEvent = eventDate < new Date();
                  navigation.navigate(
                    isPastEvent ? 'EventDetailII' : 'EventDetail', 
                    { eventId: item.id }
                  );
                }}
              />
            </View>
          );
        }}
      />
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  loginA: {
    backgroundColor: '#cfc0fe',
    padding: 16,
    marginTop: 40,
  },
  loginText: {
    textAlign: "center",
    fontSize: 24, // Tamaño de texto aumentado
    fontWeight: 'bold', // Texto en negrita (opcional)
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
