// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchRestaurants(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchRestaurants = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=restaurants`, {
        headers: {
          Authorization: `Bearer XDaGNcLiAI3zRnipfadkZiGfF1zPrbmlm12Hx1Wbhg3HRnlWi0SXvhAIKeMlI2nHkRQFmv_VZJ3zr1Gyr2Mjv6lq6l-qW4RbyB4zdLD1CcXDFVHcx0VG5ejobuNUZnYx`,
        },
      });
      setRestaurants(response.data.businesses);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.coordinates.latitude,
                longitude: restaurant.coordinates.longitude,
              }}
              title={restaurant.name}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Details', { restaurant: item })}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '50%',
  },
});

export default HomeScreen;
