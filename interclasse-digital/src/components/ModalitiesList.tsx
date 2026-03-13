import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Sport } from '../types';

type AppScreen = 'home' | 'rooms' | 'matches' | 'list';

interface Props {
  modalities: Sport[];
  onNavigate: (screen: AppScreen) => void;
}

const iconBySport: Record<Sport, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Futsal: 'soccer',
  Volei: 'volleyball',
  Basquete: 'basketball',
  Esports: 'controller-classic',
};

const descriptionBySport: Record<Sport, string> = {
  Futsal: 'Jogos rapidos e intensos na quadra com foco em agilidade.',
  Volei: 'Coordenacao em equipe, estrategia e cobertura de quadra.',
  Basquete: 'Transicao veloz, arremessos e jogo coletivo por posse.',
  Esports: 'Competicoes digitais com comunicacao, reflexo e tatica.',
};

const imageBySport: Record<Sport, string> = {
  Futsal: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=60',
  Volei: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=60',
  Basquete: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=60',
  Esports: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=60',
};

export function ModalitiesList({ modalities, onNavigate }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Modalidades em destaque</Text>
      <Text style={styles.subtitle}>Deslize para ver as competicoes da interclasse</Text>

      <FlatList
        data={modalities}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.carouselCard}>
            <Image source={{ uri: imageBySport[item] }} style={styles.cardImage} />
            <View style={styles.imageOverlay}>
              <View style={styles.cardBadge}>
                <MaterialCommunityIcons name={iconBySport[item]} size={18} color="#FFFFFF" />
                <Text style={styles.cardTitle}>{item}</Text>
              </View>
              <Text style={styles.cardText}>{descriptionBySport[item]}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.linksRow}>
        <Pressable style={styles.linkButton} onPress={() => onNavigate('rooms')}>
          <Text style={styles.linkText}>Ir para Salas</Text>
        </Pressable>
        <Pressable style={styles.linkButton} onPress={() => onNavigate('matches')}>
          <Text style={styles.linkText}>Ir para Partidas</Text>
        </Pressable>
        <Pressable style={styles.linkButton} onPress={() => onNavigate('list')}>
          <Text style={styles.linkText}>Ir para Lista</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#0D1B2A',
  },
  subtitle: {
    color: '#4B5C72',
    marginBottom: 10,
  },
  carouselCard: {
    width: 310,
    height: 170,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#0D1B2A',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(5,18,43,0.64)',
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cardText: {
    color: '#E0E7F1',
    fontSize: 13,
  },
  linksRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  linkButton: {
    backgroundColor: '#19345F',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
