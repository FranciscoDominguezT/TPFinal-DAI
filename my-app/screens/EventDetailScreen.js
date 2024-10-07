import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function EventDetailScreen({ route }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log(eventId);
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setEvent(response.data);
        } else {
          setError("No se encontraron datos del evento");
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  const handleSubscription = async (action) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.post(
        `https://open-moderately-silkworm.ngrok-free.app/api/event/${eventId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.loginA}>
        <Text style={styles.loginText}>EVENTO</Text>
      </View>
      {event ? (
        <>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <Text style={styles.textito}>Fecha: {new Date(event.start_date).toLocaleDateString()}</Text>
          <Text style={styles.textito}>{event.description}</Text>

          <View style={styles.eventDetailsContainer}>
            <Text style={styles.textit}>Categoría: {event?.event_category?.name || "Sin categoría"}</Text>
            <Text style={styles.textit}>Ubicación: {event?.event_location?.location?.name || "Sin ubicación"} - {event?.event_location?.full_address || "Sin ubicación"}</Text>
            <Text style={styles.textit}>Duración en minutos: {event.duration_in_minutes}</Text>
            <Text style={styles.textit}>Precio: ${event.price}</Text>
            <Text style={styles.textit}>Capacidad: {event.max_assistance}</Text>
          </View>

          <Text style={styles.barra}>-------------------------------------------------------</Text>

          {event.isPast ? (
            <View>
              <Text>Participantes:</Text>
              {event.participants && event.participants.length > 0 ? (
                event.participants.map((participant) => (
                  <Text key={participant.id}>
                    {participant.name} - Asistió: {participant.attended ? "Sí" : "No"}
                  </Text>
                ))
              ) : (
                <Text>No hay participantes.</Text>
              )}
            </View>
          ) : (
            <>
              <Button
                title="Inscribirse"
                onPress={() => handleSubscription("subscribe")}
              />
              <Button
                title="Desuscribirse"
                onPress={() => handleSubscription("unsubscribe")}
              />
              {message ? <Text>{message}</Text> : null}
            </>
          )}
        </>
      ) : (
        <Text>Cargando detalles del evento...</Text>
      )}
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
  }
});