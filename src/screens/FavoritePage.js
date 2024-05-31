// src/screens/FavoritePage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavoritePage = () => {
  return (
    <View style={styles.container}>
      <Text>Favorite Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoritePage;
