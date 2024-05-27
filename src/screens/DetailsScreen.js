// src/screens/DetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { restaurant } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Name: {restaurant.name}</Text>
      <Text>Rating: {restaurant.rating}</Text>
      <Text>Address: {restaurant.location.address1}</Text>
      <Text>Phone: {restaurant.phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
