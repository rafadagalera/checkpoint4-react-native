import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { CreateMatchPayload, Sport } from '../types';

interface MatchFormData extends CreateMatchPayload {
  homeScore?: number;
  awayScore?: number;
}

interface Props {
  onSave: (data: MatchFormData) => Promise<void>;
  onIntegrate: (data: MatchFormData) => Promise<void>;
  loading: boolean;
}

const availableSports: Sport[] = ['Futsal', 'Volei', 'Basquete', 'Esports'];

export function MatchForm({ onSave, onIntegrate, loading }: Props) {
  const [sport, setSport] = useState<Sport>('Futsal');
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [error, setError] = useState('');

  const buildPayload = (): MatchFormData | null => {
    if (!room.trim() || !date.trim() || !time.trim() || !location.trim()) {
      setError('Preencha sala, data, horario e local.');
      return null;
    }

    const parsedHome = homeScore.trim() === '' ? undefined : Number(homeScore);
    const parsedAway = awayScore.trim() === '' ? undefined : Number(awayScore);

    if (
      (parsedHome !== undefined && Number.isNaN(parsedHome)) ||
      (parsedAway !== undefined && Number.isNaN(parsedAway))
    ) {
      setError('Placar precisa ser numero valido.');
      return null;
    }

    setError('');

    return {
      sport,
      room: room.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      homeScore: parsedHome,
      awayScore: parsedAway,
    };
  };

  const resetForm = () => {
    setSport('Futsal');
    setRoom('');
    setDate('');
    setTime('');
    setLocation('');
    setHomeScore('');
    setAwayScore('');
  };

  const handleSave = async () => {
    const payload = buildPayload();
    if (!payload) return;
    await onSave(payload);
    resetForm();
  };

  const handleIntegrate = async () => {
    const payload = buildPayload();
    if (!payload) return;
    await onIntegrate(payload);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de partida</Text>
      <Text style={styles.sportsLabel}>Modalidade</Text>
      <View style={styles.sportsRow}>
        {availableSports.map((item) => (
          <View key={item} style={[styles.sportChip, sport === item && styles.sportChipActive]}>
            <Button title={item} onPress={() => setSport(item)} />
          </View>
        ))}
      </View>
      <TextInput
        placeholder="Sala (ex: 2A)"
        style={styles.input}
        value={room}
        onChangeText={setRoom}
      />
      <TextInput
        placeholder="Data (dd/mm/aaaa)"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder="Horario (hh:mm)"
        style={styles.input}
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        placeholder="Local da partida"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />
      <View style={styles.scoreRow}>
        <TextInput
          placeholder="Placar casa"
          keyboardType="numeric"
          style={[styles.input, styles.scoreInput]}
          value={homeScore}
          onChangeText={setHomeScore}
        />
        <TextInput
          placeholder="Placar visitante"
          keyboardType="numeric"
          style={[styles.input, styles.scoreInput]}
          value={awayScore}
          onChangeText={setAwayScore}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <Button title="Salvar no calendario" onPress={handleSave} disabled={loading} />
      </View>
      <View style={styles.actions}>
        <Button title="Integrar com API" onPress={handleIntegrate} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 8,
    color: '#102542',
  },
  sportsLabel: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#3C4A5B',
  },
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  sportChip: {
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#C7D2E3',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sportChipActive: {
    borderColor: '#395886',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7D2E3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#F8FAFD',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scoreInput: {
    flex: 1,
  },
  actions: {
    marginTop: 4,
  },
  error: {
    color: '#A4161A',
    marginBottom: 6,
    fontWeight: '600',
  },
});
