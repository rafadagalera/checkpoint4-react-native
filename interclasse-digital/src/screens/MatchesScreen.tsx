import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { postMatchApi } from '../services/api';
import { getStoredMatches, persistMatches } from '../storage/matchesStorage';
import { Match, Sport } from '../types';

const sports: Sport[] = ['Futsal', 'Volei', 'Basquete', 'Esports'];

export function MatchesScreen() {
  const [sport, setSport] = useState<Sport>('Futsal');
  const [roomA, setRoomA] = useState('');
  const [roomB, setRoomB] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const validateDate = (value: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(value);
  const validateTime = (value: string) => /^\d{2}:\d{2}$/.test(value);

  const saveMatch = async () => {
    if (!roomA.trim() || !roomB.trim() || !date.trim() || !time.trim() || !location.trim()) {
      Alert.alert('Validacao', 'Preencha todos os campos da partida.');
      return;
    }

    if (!validateDate(date) || !validateTime(time)) {
      Alert.alert('Validacao', 'Use data dd/mm/aaaa e horario hh:mm.');
      return;
    }

    setLoading(true);
    try {
      const match: Match = {
        id: `${Date.now()}`,
        sport,
        roomA: roomA.trim().toUpperCase(),
        roomB: roomB.trim().toUpperCase(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        createdAt: new Date().toISOString(),
      };

      const current = await getStoredMatches();
      const nextMatches = [match, ...current];
      await persistMatches(nextMatches);
      await postMatchApi(match);

      setRoomA('');
      setRoomB('');
      setDate('');
      setTime('');
      setLocation('');
      Alert.alert('Sucesso', 'Partida salva no AsyncStorage e enviada via POST.');
    } catch {
      Alert.alert('Erro', 'Falha ao integrar com API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>2. Cadastro de Partidas</Text>
      <Text style={styles.label}>Modalidade</Text>
      <View style={styles.row}>
        {sports.map((item) => (
          <View key={item} style={styles.sportButton}>
            <Button title={item} onPress={() => setSport(item)} color={sport === item ? '#315B8A' : '#6B7A8F'} />
          </View>
        ))}
      </View>

      <TextInput placeholder="Sala A" style={styles.input} value={roomA} onChangeText={setRoomA} />
      <TextInput placeholder="Sala B" style={styles.input} value={roomB} onChangeText={setRoomB} />
      <TextInput placeholder="Data (dd/mm/aaaa)" style={styles.input} value={date} onChangeText={setDate} />
      <TextInput placeholder="Horario (hh:mm)" style={styles.input} value={time} onChangeText={setTime} />
      <TextInput placeholder="Local da partida" style={styles.input} value={location} onChangeText={setLocation} />
      <Button
        title={loading ? 'Salvando...' : 'Salvar Partida'}
        onPress={saveMatch}
        disabled={loading}
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
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#3C4A5B',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  sportButton: {
    minWidth: 96,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7D2E3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#F8FAFD',
  },
});
