import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header } from './src/components/Header';
import { ModalitiesList } from './src/components/ModalitiesList';
import { MatchesListScreen } from './src/screens/MatchesListScreen';
import { MatchesScreen } from './src/screens/MatchesScreen';
import { RoomsScreen } from './src/screens/RoomsScreen';
import { Sport } from './src/types';

const modalities: Sport[] = ['Futsal', 'Volei', 'Basquete', 'Esports'];

type Screen = 'home' | 'rooms' | 'matches' | 'list';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  const screenTitle = screen === 'home'
    ? 'Pagina Inicial'
    : screen === 'rooms'
      ? 'Cadastro de Salas'
      : screen === 'matches'
        ? 'Cadastro de Partidas'
        : 'Lista de Partidas';

  const navItems: { key: Screen; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { key: 'home', label: 'Home', icon: 'home-variant' },
    { key: 'rooms', label: 'Salas', icon: 'google-classroom' },
    { key: 'matches', label: 'Partidas', icon: 'whistle' },
    { key: 'list', label: 'Lista', icon: 'format-list-bulleted' },
  ];

  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Sucesso', 'Todo o AsyncStorage foi limpo.');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel limpar o storage.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Header />
        <Text style={styles.screenTitle}>{screenTitle}</Text>

        <View style={styles.content}>
          {screen === 'home' ? (
            <ScrollView
              style={styles.screenScroll}
              contentContainerStyle={styles.screenScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.welcomeText}>Bem-vindo ao Interclasse Digital</Text>
              <Text style={styles.placeholderText}>
                Acompanhe modalidades, organize salas e monte partidas em poucos toques.
              </Text>
              <ModalitiesList modalities={modalities} onNavigate={setScreen} />
              <Pressable style={styles.clearStorageButton} onPress={clearAllStorage}>
                <Text style={styles.clearStorageButtonText}>Limpar todo o storage</Text>
              </Pressable>
            </ScrollView>
          ) : null}

          {screen === 'rooms' ? (
            <ScrollView
              style={styles.screenScroll}
              contentContainerStyle={styles.screenScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <RoomsScreen />
            </ScrollView>
          ) : null}

          {screen === 'matches' ? (
            <ScrollView
              style={styles.screenScroll}
              contentContainerStyle={styles.screenScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <MatchesScreen />
            </ScrollView>
          ) : null}

          {screen === 'list' ? (
            <View style={styles.screenFill}>
              <MatchesListScreen isActive={screen === 'list'} />
            </View>
          ) : null}
        </View>

        <View style={styles.footerNav}>
          {navItems.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setScreen(item.key)}
              style={styles.footerNavItem}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={screen === item.key ? '#1E5AA8' : '#6B7A90'}
              />
              <Text style={[styles.footerLabel, screen === item.key && styles.footerLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
    backgroundColor: '#F4F7FB',
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#102542',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
  screenFill: {
    flex: 1,
  },
  screenScroll: {
    flex: 1,
  },
  screenScrollContent: {
    flexGrow: 1,
    paddingBottom: 6,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102542',
    marginBottom: 4,
  },
  placeholderText: {
    color: '#4B5C72',
    marginBottom: 12,
    lineHeight: 20,
  },
  clearStorageButton: {
    backgroundColor: '#A21D25',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  clearStorageButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footerNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#D6E0EE',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 8,
    paddingVertical: 8,
  },
  footerNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7A90',
  },
  footerLabelActive: {
    color: '#1E5AA8',
    fontWeight: '700',
  },
});
