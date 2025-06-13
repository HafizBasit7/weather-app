import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { getWeatherByCity, getUsers } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tableHead = ['Profile', 'First Name', 'Last Name', 'Age', 'Gender'];
  const tableBorder = {
    borderWidth: 1,
    borderColor: '#d4e8e4',
    borderStyle: 'solid',
  };

  const handleLogout = () => navigation.replace('Login');

  const fetchWeather = async () => {
  if (!city.trim()) {
    Alert.alert('Missing City', 'Please enter a city name.');
    return;
  }

  try {
    setLoading(true);
    const weatherData = await getWeatherByCity(city);
    setWeather(weatherData);
    setError(null);
  } catch (err) {
    // console.error('Weather Fetch Error:', err?.response?.data || err.message);

    if (err?.response?.status === 404) {
      Alert.alert('City Not Found', 'Please enter a valid city name.');
    } else {
      Alert.alert('Error', 'Something went wrong while fetching weather.');
    }

    setWeather(null); 
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      const q = search.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(q) ||
          user.lastName.toLowerCase().includes(q)
      );
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  const currentDate = new Date().toLocaleString();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3DAB9B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏠 Home</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* City Input */}
      <View style={styles.cityInputContainer}>
        <TextInput
          placeholder="Enter city name..."
          placeholderTextColor="#888"
          style={styles.cityInput}
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.getWeatherButton} onPress={fetchWeather}>
          <Text style={styles.getWeatherButtonText}>Get Weather</Text>
        </TouchableOpacity>
      </View>

      {/* Weather Section */}
      {weather && (
        <View style={styles.weatherCard}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.date}>{currentDate}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>
            {weather.weather[0].description}
          </Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>💧 {weather.main.humidity}%</Text>
            <Text style={styles.detailText}>💨 {weather.wind.speed} m/s</Text>
          </View>
        </View>
      )}

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search users by name..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.sectionTitle}>👥 Registered Users</Text>

      {/* User Table */}
      <View style={styles.tableContainer}>
        <Table borderStyle={tableBorder}>
          <Row data={tableHead} style={styles.head} textStyle={styles.headText} />
        </Table>

        {filteredUsers.map((user, i) => (
          <View key={i} style={styles.row}>
            <Image source={{ uri: user.image }} style={styles.avatar} />
            <Text style={styles.cell}>{user.firstName}</Text>
            <Text style={styles.cell}>{user.lastName}</Text>
            <Text style={styles.cell}>{user.age}</Text>
            <Text style={styles.cell}>{user.gender}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcfa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3e50',
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#3DAB9B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  cityInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  cityInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 15,
    borderColor: '#dcdfe3',
    borderWidth: 1,
    marginRight: 10,
  },
  getWeatherButton: {
    backgroundColor: '#3DAB9B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
  },
  getWeatherButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
  weatherCard: {
    backgroundColor: '#3DAB9B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 4,
  },
  city: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  date: {
    color: '#e0f5f3',
    fontSize: 12,
    marginBottom: 4,
  },
  temp: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: '#f0f0f0',
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#e0f5f3',
    fontWeight: '500',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 48,
    fontSize: 15,
    marginBottom: 16,
    borderColor: '#dcdfe3',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2d3e50',
    paddingHorizontal: 4,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 30,
  },
  head: {
    height: 48,
    backgroundColor: '#e1f5f1',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#3DAB9B',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  cell: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
  },
});

export default HomeScreen;
