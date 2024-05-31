import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://your-api-url.com/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = response.data;
                setName(user.name);
                setEmail(user.email);
                setProfileImage(user.profile_image);
            }
        };
        fetchData();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setProfileImage(result.uri);
        }
    };

    const handleUpdate = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            await axios.put('http://your-api-url.com/profile', {
                name,
                email,
                profileImage,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Deletar conta",
            "Tem certeza de que deseja excluir sua conta?",
            [
                {
                    text: "Cancelar",
                    style: "cancelar"
                },
                {
                    text: "Deletar",
                    onPress: async () => {
                        const token = await AsyncStorage.getItem('token');
                        if (token) {
                            await axios.delete('http://your-api-url.com/profile', {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            // Clear local storage and navigate to login
                            await AsyncStorage.clear();
                            navigation.navigate('Login');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <View style={styles.profileImagePlaceholder}>
                        <Ionicons name="person" size={80} color="gray" />
                    </View>
                )}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
            />
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                <Text style={styles.buttonText}>Deletar Conta</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    profileImagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        marginTop: 30,
    },
    deleteButton: {
        backgroundColor: '#d9534f',
        marginTop: 10,
    },
});

export default ProfileScreen;
