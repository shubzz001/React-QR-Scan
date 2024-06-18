// src/screens/ForgotPasswordScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Forgot Password Screen</Text>
      {/* Implement your forgot password logic here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E5EC',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ForgotPasswordScreen;
