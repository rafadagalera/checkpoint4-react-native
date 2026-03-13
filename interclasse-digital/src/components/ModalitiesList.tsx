import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Sport } from '../types';

interface Props {
  modalities: Sport[];
}

const iconBySport: Record<Sport, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Futsal: 'soccer',
  Volei: 'volleyball',
  Basquete: 'basketball',
  Esports: 'controller-classic',
};

export function ModalitiesList({ modalities }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Modalidades</Text>
      <FlatList
        data={modalities}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <MaterialCommunityIcons name={iconBySport[item]} size={20} color="#0D1B2A" />
            <Text style={styles.cardText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0D1B2A',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9EEF6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    gap: 6,
  },
  cardText: {
    fontWeight: '600',
    color: '#0D1B2A',
  },
});
