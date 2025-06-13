import axios from 'axios';

const API_KEY = '6b3acfbcb611f9e8baae267815694ad4'; 

export const authApi = axios.create({
  baseURL: 'https://dummyjson.com',
});

export const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
});

export const getWeatherByCity = async (city) => {
  try {
    const response = await weatherApi.get(`/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await authApi.get('/users');
    return response.data.users;
  } catch (error) {
    throw error;
  }
};