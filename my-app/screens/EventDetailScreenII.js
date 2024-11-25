import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function EventDetailScreenII({ route }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEventDetail();
    fetchParticipants();
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("No se encontró el token");
        return;
      }

      const response = await axios.get(
        `https://open-moderately-silkworm.ngrok-free.app/api/event/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        setEvent(response.data);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const fetchParticipants = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(
        `https://open-moderately-silkworm.ngrok-free.app/api/event/${eventId}/enrollment`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setParticipants(response.data.collection || []);
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginA}>
        <Text style={styles.loginText}>EVENTO</Text>
      </View>
      {event ? (
        <ScrollView>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <Text style={styles.textito}>
            Fecha: {new Date(event.start_date).toLocaleDateString()}
          </Text>
          <Text style={styles.textito}>{event.description}</Text>

          <View style={styles.eventDetailsContainer}>
            <Text style={styles.textit}>
              Categoría: {event?.event_category?.name || "Sin categoría"}
            </Text>
            <Text style={styles.textit}>
              Ubicación: {event?.event_location?.name || "Sin ubicación"} - 
              {event?.event_location?.full_address || ""}
            </Text>
            <Text style={styles.textit}>
              Duración en minutos: {event.duration_in_minutes}
            </Text>
            <Text style={styles.textit}>Precio: ${event.price}</Text>
            <Text style={styles.textit}>Capacidad: {event.max_assistance}</Text>
          </View>

          <Text style={styles.barra}>-------------------------------------------------------</Text>

          <Text style={styles.sectionTitle}>INSCRIPTOS</Text>
          <View style={styles.participantsList}>
            {participants.map((participant, index) => (
              <View key={index} style={styles.participantRow}>
                <Text style={styles.participantName}>
                  {participant.user.first_name} {participant.user.last_name}
                </Text>
                <View style={[
                  styles.attendanceIndicator,
                  { backgroundColor: participant.attended === '1' ? '#4CAF50' : '#F44336' }
                ]} />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Cargando detalles del evento...</Text>
      )}
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: "red",
  },
  eventTitle: {
    fontSize: 24,
    marginTop: 15,
    fontWeight: "bold",
  },
  eventDetailsContainer: {
    marginTop: 20, // Separa este bloque del contenido anterior
  },
  textit: {
    fontSize: 17,
  },
  textito: {
    fontSize: 18,
  },
  barra: {
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  participantsList: {
    marginTop: 10,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  participantName: {
    fontSize: 16,
    marginRight: 10,
  },
  attendanceIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});