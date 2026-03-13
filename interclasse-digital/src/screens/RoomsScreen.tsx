import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { postRoomApi } from '../services/api';
import { getStoredRooms, persistRooms } from '../storage/roomsStorage';
import { Room } from '../types';

export function RoomsScreen() {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRooms() {
      const stored = await getStoredRooms();
      setRooms(stored);
    }

    loadRooms();
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
      <Text style={styles.title}>1. Cadastro de Salas</Text>
      <TextInput
        placeholder="Nome da sala (ex: 2A)"
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
      />
      <Button title={loading ? 'Salvando...' : 'Salvar Sala'} onPress={saveRoom} disabled={loading} />

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
  input: {
    borderWidth: 1,
    borderColor: '#C7D2E3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F8FAFD',
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
});
