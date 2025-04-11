import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { TravelEntry } from '../types';
import { useTheme } from '../context/ThemeContext';

interface Props {
  entry: TravelEntry;
  onRemove: (id: string) => void;
}

const TravelEntryCard: React.FC<Props> = ({ entry, onRemove }) => {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isDarkMode ? '#2b2b2b' : '#fff' },
        { shadowColor: isDarkMode ? '#000' : '#ccc' },
      ]}
    >
      <Image source={{ uri: entry.photoUri }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={[styles.address, { color: isDarkMode ? '#fff' : '#000' }]}>
          {entry.address}
        </Text>
        <Text style={[styles.date, { color: isDarkMode ? '#aaa' : '#666' }]}>
          {entry.date}
        </Text>
        <TouchableOpacity onPress={() => onRemove(entry.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: '100%', height: 120 },
  textContainer: { padding: 10 },
  address: { fontWeight: '600', fontSize: 14 },
  date: { fontSize: 12, marginVertical: 4 },
  removeText: {
    color: '#ff4d4d',
    marginTop: 4,
    fontWeight: '500',
    fontSize: 13,
  },
});

export default TravelEntryCard;
