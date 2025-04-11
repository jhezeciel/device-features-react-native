import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import UUID from 'react-native-uuid';
import { saveEntry } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface Entry {
  id: string;
  photoUri: string;
  address: string;
  date: string;
  title: string;
  description: string;
}

export default function AddEntryScreen() {
  const [imageUri, setImageUri] = useState('');
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  const themeStyles = {
    background: isDarkMode ? '#3b3a36' : '#f4ecd8',
    text: isDarkMode ? '#eee' : '#4b3f2f',
    buttonText: isDarkMode ? '#fffbe6' : '#3b2f2f',
    headerBg: isDarkMode ? '#2f2a25' : '#fff8e7',
    cardBackground: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(191, 167, 127, 0.4)',
  };

  useEffect(() => {
    const setupPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      if (!cameraStatus.granted) {
        Alert.alert('Permission required', 'Camera access is needed to take photos');
      }

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (!locationStatus.granted) {
        Alert.alert('Permission required', 'Location access is needed to tag your photos');
      }

      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Notification permission', 'Enable notifications to get confirmation when entries are saved');
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      }
    };

    setupPermissions();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length) {
        const uri = result.assets[0].uri;
        setImageUri(uri);

        const loc = await Location.getCurrentPositionAsync({});
        const res = await Location.reverseGeocodeAsync(loc.coords);
        const addr = `${res[0].name}, ${res[0].city}, ${res[0].country}`;
        setAddress(addr);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const importImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length) {
        const uri = result.assets[0].uri;
        setImageUri(uri);

        const loc = await Location.getCurrentPositionAsync({});
        const res = await Location.reverseGeocodeAsync(loc.coords);
        const addr = `${res[0].name}, ${res[0].city}, ${res[0].country}`;
        setAddress(addr);
      }
    } catch (error) {
      console.error('Error importing photo:', error);
      Alert.alert('Error', 'Failed to import photo. Please try again.');
    }
  };

  const sendLocalNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'A Moment Preserved! 📸',
          body: 'Now, see your life update.',
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const save = async () => {
    if (!imageUri) return Alert.alert('Missing Photo', 'Please take or import a photo to save your entry');
    if (!title.trim()) return Alert.alert('Missing Title', 'Please enter a title for your entry');

    try {
      const newEntry: Entry = {
        id: UUID.v4().toString(),
        photoUri: imageUri,
        address: address || 'Location not available',
        date: new Date().toLocaleString(),
        title: title.trim(),
        description: description.trim(),
      };

      await saveEntry(newEntry);
      await sendLocalNotification();
      navigation.goBack();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.background }]}>
      <View style={[styles.header, { backgroundColor: themeStyles.headerBg }]}>
        <Text style={[styles.title, { color: themeStyles.text }]}>Life Update</Text>
      </View>

      <View style={styles.content}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <TouchableOpacity
            style={[styles.imagePlaceholder, {
              backgroundColor: themeStyles.cardBackground,
              borderColor: themeStyles.borderColor,
            }]}
            onPress={pickImage}
          >
            <Text style={[styles.placeholderIcon, { color: themeStyles.text }]}>📷</Text>
            <Text style={[styles.placeholderText, { color: themeStyles.text }]}>Let us see your POV</Text>
          </TouchableOpacity>
        )}

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#998877"
          style={[
            styles.input,
            {
              color: themeStyles.text,
              backgroundColor: themeStyles.cardBackground,
              borderColor: themeStyles.borderColor,
            },
          ]}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#998877"
          multiline
          numberOfLines={4}
          style={[
            styles.input,
            styles.descriptionInput,
            {
              color: themeStyles.text,
              backgroundColor: themeStyles.cardBackground,
              borderColor: themeStyles.borderColor,
            },
          ]}
        />

        <View style={[
          styles.locationContainer,
          {
            backgroundColor: themeStyles.cardBackground,
            borderColor: themeStyles.borderColor,
          },
        ]}>
          <Text style={[styles.locationLabel, { color: themeStyles.text }]}>Location</Text>
          <Text style={[styles.address, { color: themeStyles.text }]}>{address || '......'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: themeStyles.cardBackground,
                borderColor: themeStyles.borderColor,
              },
            ]}
            onPress={importImage}
          >
            <Text style={[styles.buttonText, { color: themeStyles.buttonText }]}>Attach Photobooth</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { opacity: imageUri ? 1 : 0.5 }]}
            onPress={save}
            disabled={!imageUri}
          >
            <Text style={styles.saveButtonText}>Save Memory</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#bfa77f',
  },
  title: {
    fontSize: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 30,
  },
  content: { flex: 1, padding: 20 },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c7b29a',
  },
  imagePlaceholder: {
    width: '100%',
    height: 280,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  placeholderIcon: { fontSize: 48, marginBottom: 10 },
  placeholderText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginBottom: 12,
    borderWidth: 1,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  actionButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  saveButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#8b7765',
    borderWidth: 1,
    borderColor: '#3b2f2f',
  },
  saveButtonText: {
    color: '#fff8e1',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});
