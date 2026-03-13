import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header } from './src/components/Header';
import { ModalitiesList } from './src/components/ModalitiesList';
import { MatchesListScreen } from './src/screens/MatchesListScreen';
import { MatchesScreen } from './src/screens/MatchesScreen';
import { RoomsScreen } from './src/screens/RoomsScreen';
import { Sport } from './src/types';

const modalities: Sport[] = ['Futsal', 'Volei', 'Basquete', 'Esports'];

type Screen = 'rooms' | 'matches' | 'list';

export default function App() {
  const [screen, setScreen] = useState<Screen>('rooms');

  const screenTitle =
    screen === 'rooms'
      ? 'Cadastrar uma sala'
      : screen === 'matches'
        ? 'Cadastrar uma partida'
        : 'Lista de Partidas';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Header />
        <ModalitiesList modalities={modalities} />

        <Text style={styles.screenTitle}>{screenTitle}</Text>
        <View style={styles.tabs}>
          <View style={styles.tabButton}>
            <Button title="Salas" onPress={() => setScreen('rooms')} color={screen === 'rooms' ? '#315B8A' : '#7A8699'} />
          </View>
          <View style={styles.tabButton}>
            <Button
              title="Partidas"
              onPress={() => setScreen('matches')}
              color={screen === 'matches' ? '#315B8A' : '#7A8699'}
            />
          </View>
          <View style={styles.tabButton}>
            <Button title="Lista" onPress={() => setScreen('list')} color={screen === 'list' ? '#315B8A' : '#7A8699'} />
          </View>
        </View>

        {screen === 'rooms' ? <RoomsScreen /> : null}
        {screen === 'matches' ? <MatchesScreen /> : null}
        {screen === 'list' ? <MatchesListScreen isActive={screen === 'list'} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  container: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: '#F4F7FB',
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#102542',
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
  },
});
