import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, FlatList, StyleSheet, Text, View } from 'react-native';
import { getStoredMatches, persistMatches } from '../storage/matchesStorage';
import { Match } from '../types';

interface Props {
  isActive: boolean;
}

export function MatchesListScreen({ isActive }: Props) {
  const [localMatches, setLocalMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultPickerFor, setResultPickerFor] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await getStoredMatches();
      setLocalMatches(stored);
    } finally {
      setLoading(false);
    }
  }, []);

  const setMatchResult = async (matchId: string, result: 'A' | 'DRAW' | 'B') => {
    const nextMatches = localMatches.map((item) =>
      item.id === matchId
        ? {
            ...item,
            result,
          }
        : item
    );
    setLocalMatches(nextMatches);
    await persistMatches(nextMatches);
    setResultPickerFor(null);
  };

  const resultLabel = (item: Match) => {
    if (item.result === 'A') return `Vencedor: ${item.roomA}`;
    if (item.result === 'B') return `Vencedor: ${item.roomB}`;
    if (item.result === 'DRAW') return 'Resultado: Empate';
    return 'Resultado: Nao definido';
  };

  useEffect(() => {
    if (isActive) {
      loadData();
    }
  }, [isActive, loadData]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Lista de Partidas</Text>
      <Text style={styles.subtitleText}>Painel unificado com partidas locais e dados da API.</Text>
      <Pressable style={styles.primaryButton} onPress={loadData} disabled={loading}>
        <Text style={styles.primaryButtonText}>{loading ? 'Atualizando...' : 'Atualizar Lista'}</Text>
      </Pressable>

      <Text style={styles.subtitle}>Partidas locais (AsyncStorage)</Text>
      <FlatList
        data={localMatches}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Sem partidas locais cadastradas.</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="calendar-month" size={18} color="#275D9A" />
              <Text style={styles.itemText}>
                {item.sport}: {item.roomA} x {item.roomB}
              </Text>
            </View>
            <Text style={styles.itemSubtext}>
              {item.date} {item.time} - {item.location}
            </Text>
            <Text style={styles.resultText}>{resultLabel(item)}</Text>
            <Pressable
              style={styles.defineButton}
              onPress={() =>
                setResultPickerFor((current) => (current === item.id ? null : item.id))
              }
            >
              <Text style={styles.defineButtonText}>Definir resultado</Text>
            </Pressable>
            {resultPickerFor === item.id ? (
              <View style={styles.resultRow}>
                <Pressable style={styles.resultButton} onPress={() => setMatchResult(item.id, 'A')}>
                  <Text style={styles.resultButtonText}>A venceu</Text>
                </Pressable>
                <Pressable style={styles.resultButton} onPress={() => setMatchResult(item.id, 'DRAW')}>
                  <Text style={styles.resultButtonText}>Empate</Text>
                </Pressable>
                <Pressable style={styles.resultButton} onPress={() => setMatchResult(item.id, 'B')}>
                  <Text style={styles.resultButtonText}>B venceu</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D8DEE8',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102542',
    marginBottom: 4,
  },
  subtitleText: {
    color: '#4E6078',
    marginBottom: 10,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#19345F',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    borderColor: '#DAE3F1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#F7FAFF',
    shadowColor: '#112A46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
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
  resultText: {
    marginTop: 6,
    color: '#173A68',
    fontWeight: '700',
  },
  resultRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  defineButton: {
    marginTop: 8,
    backgroundColor: '#173A68',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  defineButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultButton: {
    backgroundColor: '#E8EFFB',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  resultButtonText: {
    color: '#173A68',
    fontWeight: '700',
    fontSize: 12,
  },
});
