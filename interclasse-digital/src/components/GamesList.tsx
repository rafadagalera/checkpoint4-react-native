import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { Match } from '../types';

interface Props {
  data: Match[];
  onToggleStatus: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export function GamesList({ data, onToggleStatus, onRemove }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Calendario de jogos</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma partida cadastrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.sport}>{item.sport}</Text>
              <View style={styles.statusWrap}>
                <MaterialCommunityIcons
                  name={item.status === 'Finalizado' ? 'check-circle' : 'clock-outline'}
                  size={18}
                  color={item.status === 'Finalizado' ? '#2A9D8F' : '#E9C46A'}
                />
                <Text style={styles.status}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.text}>Sala: {item.room}</Text>
            <Text style={styles.text}>
              Data/Horario: {item.date} - {item.time}
            </Text>
            <Text style={styles.text}>Local: {item.location}</Text>
            {typeof item.homeScore === 'number' && typeof item.awayScore === 'number' ? (
              <Text style={styles.text}>
                Placar: {item.homeScore} x {item.awayScore}
              </Text>
            ) : null}
            <View style={styles.actions}>
              <View style={styles.buttonWrap}>
                <Button
                  title={item.status === 'Agendado' ? 'Marcar finalizado' : 'Reabrir'}
                  onPress={() => onToggleStatus(item.id)}
                />
              </View>
              <View style={styles.buttonWrap}>
                <Button title="Remover" color="#B02A37" onPress={() => onRemove(item.id)} />
              </View>
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
    borderWidth: 1,
    borderColor: '#D8DEE8',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#102542',
  },
  empty: {
    color: '#5A6678',
  },
  card: {
    borderWidth: 1,
    borderColor: '#E6ECF4',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#FAFCFF',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sport: {
    fontWeight: '700',
    color: '#1D2D44',
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  status: {
    color: '#3C4A5B',
  },
  text: {
    color: '#3C4A5B',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    gap: 8,
  },
  buttonWrap: {
    flex: 1,
  },
});
