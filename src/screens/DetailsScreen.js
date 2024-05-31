import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({ route }) => {
  const { restaurant } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const savedFeedbacks = await AsyncStorage.getItem(`feedback-${restaurant.id}`);
        if (savedFeedbacks) {
          setFeedbackList(JSON.parse(savedFeedbacks));
        }
      } catch (error) {
        console.error("Failed to load feedbacks", error);
      }
    };
    loadFeedbacks();
  }, [restaurant.id]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      const newFeedbackList = [...feedbackList, feedback];
      setFeedbackList(newFeedbackList);
      setFeedback('');
      try {
        await AsyncStorage.setItem(`feedback-${restaurant.id}`, JSON.stringify(newFeedbackList));
      } catch (error) {
        console.error("Failed to save feedback", error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: restaurant.image_url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <TouchableOpacity onPress={handleFavorite}>
            <Icon
              name={isFavorite ? 'heart' : 'heart-o'}
              size={30}
              color={isFavorite ? '#E74C3C' : '#BDC3C7'}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.rating}>⭐⭐⭐⭐⭐ {restaurant.rating}</Text>
        <Text style={styles.address}>{restaurant.location.address1}</Text>
        <Text style={styles.phone}>{restaurant.phone}</Text>
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Feedback dos Usuários</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Deixe seu feedback..."
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity style={styles.feedbackButton} onPress={handleFeedbackSubmit}>
          <Text style={styles.feedbackButtonText}>Enviar</Text>
        </TouchableOpacity>

        {feedbackList.map((item, index) => (
          <View key={index} style={styles.feedbackItem}>
            <Text style={styles.feedbackText}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  favoriteIcon: {
    padding: 10,
  },
  rating: {
    fontSize: 20,
    color: '#F39C12',
    marginBottom: 10,
  },
  address: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  phone: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  feedbackContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  feedbackInput: {
    borderColor: '#DADFE1',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#F8F9F9',
  },
  feedbackButton: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackItem: {
    backgroundColor: '#ECF0F1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: '#2C3E50',
  },
});

export default DetailsScreen;
