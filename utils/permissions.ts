import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Camera } from 'expo-camera';

export const requestPermissions = async () => {
  await Camera.requestCameraPermissionsAsync();
  await Location.requestForegroundPermissionsAsync();
  await Notifications.requestPermissionsAsync();
};
