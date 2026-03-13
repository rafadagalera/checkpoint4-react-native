import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RankingRow } from '../types';

interface Props {
  data: RankingRow[];
  loading: boolean;
}

export function RankingTable({ data, loading }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Tabela de classificacao (salas)</Text>
      {loading ? <Text style={styles.loading}>Atualizando pontuacao...</Text> : null}

      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.roomCell]}>Sala</Text>
        <Text style={styles.headerCell}>Jogos</Text>
        <Text style={styles.headerCell}>Pontos</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.room}
        ListEmptyComponent={<Text style={styles.empty}>Sem dados de classificacao.</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <View style={styles.roomCell}>
              <Text style={styles.roomText}>
                {index + 1}. {item.room}
              </Text>
            </View>
            <Text style={styles.itemCell}>{item.games}</Text>
            <View style={styles.pointsCell}>
              <MaterialCommunityIcons name="star-circle" size={18} color="#F4A261" />
              <Text style={styles.itemCell}>{item.points}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D8DEE8',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#102542',
  },
  loading: {
    marginBottom: 8,
    color: '#3C4A5B',
  },
  headerRow: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E6ECF4',
  },
  headerCell: {
    flex: 1,
    fontWeight: '700',
    color: '#1D2D44',
  },
  roomCell: {
    flex: 1.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
  },
  roomText: {
    color: '#1D2D44',
    fontWeight: '600',
  },
  itemCell: {
    flex: 1,
    color: '#3C4A5B',
  },
  pointsCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  empty: {
    marginTop: 8,
    color: '#5A6678',
  },
});
