import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/welcome.gif')}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bem-vindo ao FoodFinder!</Text>
        <Text style={styles.subtitle}>Sua plataforma para encontrar os melhores restaurantes próximo de você. Descubra novos sabores e experiências gastronômicas incríveis, onde quer que esteja!</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.signupButton]}  // Adiciona um segundo botão com estilo modificado
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonTextUp}>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  textContainer: {
    width: '100%',
    marginBottom: 28,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
  },
  button: {
    backgroundColor: 'tomato',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10, // Adiciona um espaço entre os botões
  },
  signupButton: {
    backgroundColor: '#fff', // Cor diferente para o botão de cadastro
    borderWidth: 2, // Adiciona a borda de 2px
    borderColor: 'tomato', // Define a cor da borda
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextUp: {
    color: 'tomato',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
