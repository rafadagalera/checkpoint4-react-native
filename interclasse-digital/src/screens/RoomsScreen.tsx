import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { postRoomApi } from '../services/api';
import { getStoredRooms, persistRooms } from '../storage/roomsStorage';
import { Room } from '../types';

export function RoomsScreen() {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

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

  const listAllRooms = async () => {
    const stored = await getStoredRooms();
    setRooms(stored);
    setShowList(true);
  };

  const deleteAllRooms = async () => {
    await persistRooms([]);
    setRooms([]);
    setShowList(false);
    Alert.alert('Sucesso', 'Todas as salas foram removidas.');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>1. Cadastro de Salas</Text>
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

      <View style={styles.actionsRow}>
        <Pressable style={styles.secondaryButton} onPress={listAllRooms}>
          <Text style={styles.secondaryButtonText}>Listar Salas</Text>
        </Pressable>
        <Pressable style={styles.dangerButton} onPress={deleteAllRooms}>
          <Text style={styles.dangerButtonText}>Excluir Salas</Text>
        </Pressable>
      </View>

      {showList ? (
        <>
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
        </>
      ) : null}
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
  actionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E8EFFB',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#173A68',
    fontWeight: '700',
  },
  dangerButton: {
    flex: 1,
    backgroundColor: '#FCEAEA',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#A21D25',
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
});
