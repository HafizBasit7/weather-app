import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    if (!formData.username || !formData.password || !formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://dummyjson.com/users/add', {
        ...formData,
        age: Number(formData.age),
      });

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Failed',
        error?.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      {[
        { label: 'First Name *', name: 'firstName', placeholder: 'firstName' },
        { label: 'Last Name *', name: 'lastName', placeholder: 'lastName' },
        { label: 'Username *', name: 'username', placeholder: 'username' },
        { label: 'Password *', name: 'password', placeholder: '••••••••', secureTextEntry: true },
        { label: 'Age', name: 'age', placeholder: 'age', keyboardType: 'numeric' },
        { label: 'Gender', name: 'gender', placeholder: 'male/female/other' },
        { label: 'Email', name: 'email', placeholder: '@example.com', keyboardType: 'email-address' },
        { label: 'Phone', name: 'phone', placeholder: '+92 234567890', keyboardType: 'phone-pad' },
      ].map(({ label, name, placeholder, secureTextEntry, keyboardType }) => (
        <View key={name} style={styles.inputContainer}>
          <Ionicons
            name={
              name === 'password' ? 'lock-closed-outline' :
              name === 'email' ? 'mail-outline' :
              name === 'phone' ? 'call-outline' :
              name === 'age' ? 'calendar-outline' :
              name === 'gender' ? 'transgender-outline' :
              'person-outline'
            }
            size={20}
            color="#888"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            placeholderTextColor="#888"
            value={formData[name]}
            onChangeText={(text) => handleChange(name, text)}
          />
        </View>
      ))}

      {loading ? (
        <ActivityIndicator size="large" color="#3DAB9B" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2d3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
    borderRadius: 30,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#3DAB9B',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#3DAB9B',
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
});

export default SignupScreen;
