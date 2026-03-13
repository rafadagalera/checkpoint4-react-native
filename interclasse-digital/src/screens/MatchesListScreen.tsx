import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { ExternalMatch, getMatchesApi } from '../services/api';
import { getStoredMatches } from '../storage/matchesStorage';
import { Match } from '../types';

interface Props {
  isActive: boolean;
}

export function MatchesListScreen({ isActive }: Props) {
  const [localMatches, setLocalMatches] = useState<Match[]>([]);
  const [externalMatches, setExternalMatches] = useState<ExternalMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [stored, apiData] = await Promise.all([getStoredMatches(), getMatchesApi()]);
      setLocalMatches(stored);
      setExternalMatches(apiData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      loadData();
    }
  }, [isActive, loadData]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>3. Lista de Partidas</Text>
      <Button title={loading ? 'Atualizando...' : 'Atualizar Lista'} onPress={loadData} disabled={loading} />

      <Text style={styles.subtitle}>Partidas locais (AsyncStorage)</Text>
      <FlatList
        data={localMatches}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Sem partidas locais cadastradas.</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="calendar-month" size={18} color="#1D3557" />
              <Text style={styles.itemText}>
                {item.sport}: {item.roomA} x {item.roomB}
              </Text>
            </View>
            <Text style={styles.itemSubtext}>
              {item.date} {item.time} - {item.location}
            </Text>
          </View>
        )}
      />

      <Text style={styles.subtitle}>Dados externos (GET API)</Text>
      <FlatList
        data={externalMatches}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemText}>
              #{item.id} - {item.homeTeam} x {item.awayTeam}
            </Text>
            <Text style={styles.itemSubtext}>
              {item.date} {item.hour} - {item.court}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D8DEE8',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#102542',
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#1D2D44',
  },
  empty: {
    color: '#5A6678',
  },
  itemCard: {
    borderWidth: 1,
    borderColor: '#E6ECF4',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    backgroundColor: '#FAFCFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemText: {
    color: '#1D2D44',
    fontWeight: '600',
  },
  itemSubtext: {
    color: '#3C4A5B',
    marginTop: 4,
  },
});
