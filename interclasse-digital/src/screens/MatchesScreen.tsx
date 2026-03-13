import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const [showModalities, setShowModalities] = useState(false);

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
      <Text style={styles.subtitleText}>Configure um jogo com data, horario e local da partida.</Text>

      <Text style={styles.label}>Modalidade</Text>
      <Pressable style={styles.dropdown} onPress={() => setShowModalities((current) => !current)}>
        <Text style={styles.dropdownText}>{sport}</Text>
        <MaterialCommunityIcons
          name={showModalities ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#1D3557"
        />
      </Pressable>

      {showModalities ? (
        <View style={styles.dropdownOptions}>
          {sports.map((item) => (
            <Pressable
              key={item}
              style={[styles.optionButton, sport === item && styles.optionButtonActive]}
              onPress={() => {
                setSport(item);
                setShowModalities(false);
              }}
            >
              <Text style={[styles.optionText, sport === item && styles.optionTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.row}>
        <TextInput placeholder="Sala A" style={[styles.input, styles.halfInput]} value={roomA} onChangeText={setRoomA} />
        <TextInput placeholder="Sala B" style={[styles.input, styles.halfInput]} value={roomB} onChangeText={setRoomB} />
      </View>

      <TextInput placeholder="Data (dd/mm/aaaa)" style={styles.input} value={date} onChangeText={setDate} />
      <TextInput placeholder="Horario (hh:mm)" style={styles.input} value={time} onChangeText={setTime} />
      <TextInput placeholder="Local da partida" style={styles.input} value={location} onChangeText={setLocation} />
      <Pressable style={styles.primaryButton} onPress={saveMatch} disabled={loading}>
        <Text style={styles.primaryButtonText}>{loading ? 'Salvando...' : 'Salvar Partida'}</Text>
      </Pressable>
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
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#3C4A5B',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#C7D2E3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#F8FAFD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropdownText: {
    color: '#173A68',
    fontWeight: '700',
  },
  dropdownOptions: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D3DEEE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F8',
  },
  optionButtonActive: {
    backgroundColor: '#E8EFFB',
  },
  optionText: {
    color: '#345375',
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#163A68',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  halfInput: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7D2E3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#F8FAFD',
  },
  primaryButton: {
    marginTop: 2,
    backgroundColor: '#19345F',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
