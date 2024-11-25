import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function EventDetailScreen({ route }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEventDetail();
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
        // Check if user is already subscribed
        checkSubscriptionStatus(token);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const checkSubscriptionStatus = async (token) => {
    try {
      const response = await axios.get(
        `https://open-moderately-silkworm.ngrok-free.app/api/event/${eventId}/check-enrollment`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsSubscribed(response.data.isSubscribed);
    } catch (err) {
      console.error("Error checking subscription status:", err);
    }
  };

  const handleSubscription = async (action) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      
      if (action === "subscribe") {
        await axios.post(
          `https://open-moderately-silkworm.ngrok-free.app/api/event/${eventId}/enrollment`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.delete(
          `https://open-moderately-silkworm.ngrok-free.app/api/event/${eventId}/enrollment`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      
      setIsSubscribed(action === "subscribe");
      Alert.alert(
        "Éxito",
        action === "subscribe" ? 
          "Te has suscrito al evento exitosamente" : 
          "Te has desuscrito del evento exitosamente"
      );
      
      // Actualizar el estado de suscripción
      checkSubscriptionStatus(token);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
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

          <Text style={styles.barra}>
            -------------------------------------------------------
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              isSubscribed ? styles.unsubButton : styles.suscribirse,
              isLoading && styles.disabled
            ]}
            onPress={() => handleSubscription(isSubscribed ? "unsubscribe" : "subscribe")}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading 
                ? "Procesando..." 
                : isSubscribed 
                  ? "Desuscribirse" 
                  : "Suscribirse"}
            </Text>
          </TouchableOpacity>
        </>
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
  suscribirse: {
    backgroundColor: '#4236cf',
    padding: 14,
    marginTop: 10,
    borderRadius: 20, // Bordes redondeados
    alignItems: 'center', // Centrar el texto dentro del botón
  },
  buttonText: {
    color: 'white',
    fontSize: 18, // Tamaño de texto aumentado
    textTransform: 'uppercase', // Texto en mayúsculas
    fontWeight: 'bold', // Texto en negrita (opcional)
  },
  unsubButton: {
    backgroundColor: '#fc0b03',
    padding: 14,
    marginTop: 10,
    borderRadius: 20, // Bordes redondeados
    alignItems: 'center', // Centrar el texto dentro del botón
  },
});