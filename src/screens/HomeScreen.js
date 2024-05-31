import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: {
          Authorization: `Bearer XDaGNcLiAI3zRnipfadkZiGfF1zPrbmlm12Hx1Wbhg3HRnlWi0SXvhAIKeMlI2nHkRQFmv_VZJ3zr1Gyr2Mjv6lq6l-qW4RbyB4zdLD1CcXDFVHcx0VG5ejobuNUZnYx`
        },
        params: {
          term: 'restaurants',
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          sort_by: 'rating', // Fetch best rated restaurants
          limit: 10 // Limit to top 10
        }
      });
      setRestaurants(response.data.businesses);
      setLoading(false);
    })();
  }, []);

  const toggleFavorite = (restaurantId) => {
    const isFavorite = favorites.includes(restaurantId);
    if (isFavorite) {
      setFavorites(favorites.filter(id => id !== restaurantId));
    } else {
      setFavorites([...favorites, restaurantId]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('DetailsScreen', { restaurant: item })}
          >
            <ImageBackground source={{ uri: item.image_url }} style={styles.image}>
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.name}</Text>
                <Text style={styles.overlayText}>{item.location.address1}</Text>
                <Text style={styles.overlayText}>⭐⭐⭐⭐⭐ {item.rating}</Text>
              </View>
            </ImageBackground>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}>
              <MaterialIcons
                name={favorites.includes(item.id) ? 'favorite' : 'favorite-border'}
                size={24}
                color={favorites.includes(item.id) ? '#ff0000' : '#fff'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  listItem: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
});

export default HomeScreen;
