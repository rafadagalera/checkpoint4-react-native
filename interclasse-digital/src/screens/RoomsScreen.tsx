import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { postRoomApi } from '../services/api';
import { getStoredMatches } from '../storage/matchesStorage';
import { getStoredRooms, persistRooms } from '../storage/roomsStorage';
import { LocalRankingRow, Match, Room } from '../types';

function buildRanking(rooms: Room[], matches: Match[]): LocalRankingRow[] {
  const rankingMap = new Map<string, LocalRankingRow>();

  rooms.forEach((room) => {
    rankingMap.set(room.name.toUpperCase(), {
      room: room.name.toUpperCase(),
      points: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
    });
  });

  matches.forEach((match) => {
    if (!match.result) return;

    const roomA = rankingMap.get(match.roomA.toUpperCase());
    const roomB = rankingMap.get(match.roomB.toUpperCase());
    if (!roomA || !roomB) return;

    roomA.played += 1;
    roomB.played += 1;

    if (match.result === 'A') {
      roomA.wins += 1;
      roomA.points += 3;
      roomB.losses += 1;
      return;
    }

    if (match.result === 'B') {
      roomB.wins += 1;
      roomB.points += 3;
      roomA.losses += 1;
      return;
    }

    roomA.draws += 1;
    roomB.draws += 1;
    roomA.points += 1;
    roomB.points += 1;
  });

  return [...rankingMap.values()].sort((left, right) => {
    if (right.points !== left.points) return right.points - left.points;
    if (right.wins !== left.wins) return right.wins - left.wins;
    return left.room.localeCompare(right.room);
  });
}

export function RoomsScreen() {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [ranking, setRanking] = useState<LocalRankingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshLocalData = async () => {
    const [storedRooms, storedMatches] = await Promise.all([getStoredRooms(), getStoredMatches()]);
    setRooms(storedRooms);
    setRanking(buildRanking(storedRooms, storedMatches));
  };

  useEffect(() => {
    refreshLocalData();
  }, []);

  const saveRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Validacao', 'Digite o nome da sala.');
      return;
    }

    setLoading(true);
    try {
      const room: Room = {
        id: `${Date.now()}`,
        name: roomName.trim().toUpperCase(),
        createdAt: new Date().toISOString(),
      };

      const nextRooms = [room, ...rooms];
      setRooms(nextRooms);
      await persistRooms(nextRooms);
      await postRoomApi(room);
      const storedMatches = await getStoredMatches();
      setRanking(buildRanking(nextRooms, storedMatches));
      setRoomName('');
      Alert.alert('Sucesso', 'Sala salva no AsyncStorage e enviada via POST.');
    } catch {
      Alert.alert('Erro', 'Falha ao integrar com API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cadastro de Salas</Text>
      <Text style={styles.subtitleText}>Registre as turmas para montar os confrontos.</Text>
      <TextInput
        placeholder="Nome da sala (ex: 2A)"
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
      />
      <Pressable style={styles.primaryButton} onPress={saveRoom} disabled={loading}>
        <Text style={styles.primaryButtonText}>{loading ? 'Salvando...' : 'Salvar Sala'}</Text>
      </Pressable>

      <Text style={styles.subtitle}>Salas cadastradas</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma sala cadastrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <MaterialCommunityIcons name="google-classroom" size={18} color="#1D3557" />
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      />

      <Text style={styles.subtitle}>Classificacao</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.roomColumn]}>Sala</Text>
        <Text style={styles.tableCell}>P</Text>
        <Text style={styles.tableCell}>J</Text>
        <Text style={styles.tableCell}>V</Text>
        <Text style={styles.tableCell}>E</Text>
        <Text style={styles.tableCell}>D</Text>
      </View>
      <FlatList
        data={ranking}
        keyExtractor={(item) => item.room}
        ListEmptyComponent={<Text style={styles.empty}>Sem resultados para classificar.</Text>}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.tableValue, styles.roomColumn]}>{item.room}</Text>
            <Text style={styles.tableValue}>{item.points}</Text>
            <Text style={styles.tableValue}>{item.played}</Text>
            <Text style={styles.tableValue}>{item.wins}</Text>
            <Text style={styles.tableValue}>{item.draws}</Text>
            <Text style={styles.tableValue}>{item.losses}</Text>
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
    marginBottom: 6,
  },
  subtitleText: {
    color: '#4E6078',
    marginBottom: 10,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7D2E3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F8FAFD',
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F8',
  },
  itemText: {
    color: '#3C4A5B',
    fontWeight: '600',
  },
  empty: {
    color: '#5A6678',
  },
  tableHeader: {
    marginTop: 4,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DDE6F2',
    paddingBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F8',
  },
  tableCell: {
    flex: 1,
    fontWeight: '700',
    color: '#173A68',
  },
  tableValue: {
    flex: 1,
    color: '#2E425C',
  },
  roomColumn: {
    flex: 2,
  },
});
