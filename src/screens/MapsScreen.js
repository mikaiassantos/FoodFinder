import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TextInput, Text, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const MapsScreen = () => {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão para acessar a localização foi negada');
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
          limit: 20,
        }
      });

      setRestaurants(response.data.businesses);
      setLoading(false);
    })();
  }, []);

  const handleSearch = async () => {
    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer XDaGNcLiAI3zRnipfadkZiGfF1zPrbmlm12Hx1Wbhg3HRnlWi0SXvhAIKeMlI2nHkRQFmv_VZJ3zr1Gyr2Mjv6lq6l-qW4RbyB4zdLD1CcXDFVHcx0VG5ejobuNUZnYx`
      },
      params: {
        term: search,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        limit: 1,
      }
    });

    if (response.data.businesses.length > 0) {
      const restaurant = response.data.businesses[0];
      setLocation({
        coords: {
          latitude: restaurant.coordinates.latitude,
          longitude: restaurant.coordinates.longitude,
        },
      });
    }
  };

  const openRestaurantModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const closeRestaurantModal = () => {
    setSelectedRestaurant(null);
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
      <View style={styles.searchBarContainer}>
        <MaterialIcons name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar restaurante"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
      </View>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {restaurants.map(restaurant => (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.coordinates.latitude,
                longitude: restaurant.coordinates.longitude,
              }}
              onPress={() => openRestaurantModal(restaurant)}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                  <Text style={styles.calloutAddress}>{restaurant.location.address1}</Text>
                  <Text style={styles.calloutRating}>Avaliação: {restaurant.rating}</Text>
                  <Text style={styles.calloutPhone}>{restaurant.phone}</Text>
                  <TouchableOpacity style={styles.directionsButton}>
                    <Text style={styles.directionsButtonText}>Direções</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
      <View style={styles.restaurantList}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.restaurantListContent}>
          {restaurants.map(restaurant => (
            <TouchableOpacity key={restaurant.id} style={styles.restaurantCard} onPress={() => openRestaurantModal(restaurant)}>
              {restaurant.image_url ? (
                <Image source={{ uri: restaurant.image_url }} style={styles.restaurantImage} />
              ) : (
                <View style={styles.restaurantNoImage}>
                  <Text style={styles.restaurantNoImageText}>No Image</Text>
                </View>
              )}
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Modal visible={selectedRestaurant !== null} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRestaurant && (
              <ScrollView>
                <Image source={{ uri: selectedRestaurant.image_url }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
                <Text style={styles.modalAddress}>{selectedRestaurant.location.address1}</Text>
                <Text style={styles.modalRating}>Avaliação: {selectedRestaurant.rating}</Text>
                <Text style={styles.modalPhone}>{selectedRestaurant.phone}</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={closeRestaurantModal}>
                  <Text style={styles.modalCloseButtonText}>Fechar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  callout: {
    width: 200,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007bff',
  },
  calloutAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  calloutRating: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  calloutPhone: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  directionsButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 3,
    alignItems: 'center',
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  restaurantList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  restaurantListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  restaurantCard: {
    marginRight: 10,
    alignItems: 'center',
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  restaurantNoImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantNoImageText: {
    fontSize: 16,
    color: '#555',
  },
  restaurantName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalAddress: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalRating: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalPhone: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapsScreen;
