import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import { ThemeProvider } from './context/ThemeContext';
import { RootStackParamList } from './types/index'; 
import NotificationScreen from './components/LocalPushNotification';
import { TravelDiaryProvider } from './context/TravelDiaryContext'; 

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen}
          options={{ headerShown: false }} />
          <Stack.Screen name="AddEntry" component={AddEntryScreen}
          options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  ); 
}
