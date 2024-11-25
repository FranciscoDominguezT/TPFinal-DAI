import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    setError('No se encontró el token de autenticación.');
                    return;
                }

                const response = await axios.get(
                    'https://open-moderately-silkworm.ngrok-free.app/api/user/profile',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setError(response.data.message || 'No se pudo cargar la información del usuario.');
                }
            } catch (err) {
                setError('Error al cargar el perfil del usuario.');
                console.error(err);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <View style={styles.loginA}>
                        <Text style={styles.loginText}>PROFILE</Text>
                    </View>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text style={styles.info}>{user.first_name}</Text>
                    <Text style={styles.label}>Apellido:</Text>
                    <Text style={styles.info}>{user.last_name}</Text>
                    <Text style={styles.label}>Correo electrónico:</Text>
                    <Text style={styles.info}>{user.username}</Text>
                </>
            ) : (
                <Text style={styles.error}>{error || 'Cargando perfil...'}</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});
