import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { TravelEntry } from '../types';
import { getEntries, removeEntry } from '../utils/storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import Logo from '../assets/logo.png';

export default function HomeScreen() {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      const fetchEntries = async () => {
        const storedEntries = await getEntries();
        setEntries(storedEntries);
      };
      fetchEntries();
    }, [])
  );

  const handleRemoveEntry = async (id: string) => {
    await removeEntry(id);
    const updatedEntries = await getEntries();
    setEntries(updatedEntries);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#2e2b25' : '#f4ecd8' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#3a3a3a' : '#fff7ea' }]}>
        <View style={styles.titleContainer}>
          <Image source={Logo} style={styles.logo} />
          <Text style={[styles.title, { color: isDarkMode ? '#f5f5f5' : '#4c3b2a' }]}>
            Time-Travel
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeToggle, { backgroundColor: isDarkMode ? '#6d6d6d' : '#d4c2a5' }]}
        >
          <Text style={{ fontSize: 16, color: isDarkMode ? '#fff' : '#3a2c1e' }}>◐</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.tagline, { color: isDarkMode ? '#e3dbc6' : '#5f4b39' }]}>
        Explore New Places Without Fear of Missing
      </Text>

      {entries.length === 0 ? (
        <Text style={[styles.noEntries, { color: isDarkMode ? '#aaa' : '#7a5c42' }]}>
          No travel memories yet...
        </Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                {
                  transform: [{ rotate: '-1.5deg' }],
                  backgroundColor: isDarkMode ? '#403d36' : '#fffaf3',
                },
              ]}
            >
              <Image source={{ uri: item.photoUri }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDarkMode ? '#000' : '#5a4633' }]}>
                  {item.title}
                </Text>
                <Text style={[styles.cardDescription, { color: isDarkMode ? '#fff':'7a6450' }]}>
                  {item.description}
                </Text>
                <Text style={[styles.cardAddress, { color: isDarkMode ? '#bba98a' : '#96806a' }]}>
                  📍 {item.address}
                </Text>
                <Text style={[styles.cardDate, { color: isDarkMode ? '#a69274' : '#b59f85' }]}>
                  🕰 {item.date}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveEntry(item.id)} style={styles.deleteBtn}>
                <Text style={{ fontSize: 20, color: isDarkMode ? '#fff':'#fff' }}>x</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: isDarkMode ? '#5d5a55' : '#b49b7d' }]}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 12,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Palatino',
  },
  tagline: {
    fontSize: 18,
    fontStyle: 'italic',
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 16,
  },
  themeToggle: {
    padding: 8,
    borderRadius: 12,
  },
  noEntries: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
    fontFamily: 'Georgia',
  },
  grid: {
    paddingBottom: 80,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    flex: 0.48,
    marginBottom: 28,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#c1b8a4',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 140,
    borderBottomWidth: 1,
    borderColor: '#d5cbb8',
    borderRadius: 8,
  },
  cardContent: {
    padding: 12,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderColor: '#eee0c4',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Palatino',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: 'Palatino',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  cardAddress: {
    fontSize: 12,
    fontFamily: 'Georgia',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 11,
    fontFamily: 'Times New Roman',
  },
  deleteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 12,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  addButtonText: {
    fontSize: 34,
    color: '#fffaf3',
  },
});
