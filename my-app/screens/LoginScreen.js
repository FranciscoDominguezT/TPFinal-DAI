import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../utils/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('pablo.ulman@ort.edu.ar');
  const [password, setPassword] = useState('pabulm101');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Attempting to log in with:', { username, password });
      const response = await login(username, password);
      console.log('Login response:', response);
      
      if (response.success) {
        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem('userToken', response.token);
        alert('Login completado');
        
        // Navegar a la pantalla de eventos
        navigation.navigate('Events');
      } else {
        setError(response.message);
        console.log('Error message from response:', response.message);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.log('Error caught in catch block:', err);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.loginA}>
        <Text style={styles.loginText}>LOGIN</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://lh7-rt.googleusercontent.com/docsz/AD_4nXcPcAkWPu8rDqhKRt7fZOP6_HGT9NC9WlH8IHW2c4UcqaRT_VabF_GB-kghum9Sxvl7OgkxU56en42J5FD1_u0TySf_loPeEGZWp-KszLbtR5v5KtuhfLokHFFy_QZGxJz38WRuMHXJPcxBpmujVg?key=VKJaD4CUpFDLTPgfGROqhA' }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.container}>
        <Text>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <Text>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Login" onPress={handleLogin} />
      </View>
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
  imageContainer: {
    alignItems: 'center', // Centra la imagen horizontalmente
  },
  image: {
    marginTop: 10,
    width: '100%', // Ancho completo del contenedor
    height: 'auto',
    aspectRatio: 1.5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});
