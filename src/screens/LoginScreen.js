import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';  // Adjust the import path as necessary

const LoginScreen = ({ navigation }) => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail && savedPassword) {
          await authenticate(savedEmail, savedPassword);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkLogin();
  }, []);

  const authenticate = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}Users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: email, Password: password }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log('User', user);

        // Log the type of the user.id to ensure it is as expected
        console.log('Type of user.id:', typeof user.id);

        if (user && user.id) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Login Failed', 'Invalid Username or Password');
        }
      } else {
        Alert.alert('Login Failed', 'Server returned an error');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred', 'Please try again later');
    }
  };

  const submit = async () => {
    try {
      await authenticate(Email, Password);
      await AsyncStorage.setItem('email', Email);
      await AsyncStorage.setItem('password', Password);
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred', 'Please try again later');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#aaa" 
          autoCorrect={false}
          value={Email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#aaa" 
          secureTextEntry 
          autoCapitalize="none"
          autoCorrect={false}
          value={Password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '80%',
    backgroundColor: '#E0E5EC',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#E0E5EC',
    color: '#333',
  },
  forgotPasswordText: {
    color: '#555',
    marginTop: 10,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#E0E5EC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
