import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

export function Header() {
  return (
    <View style={styles.wrapper}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=60',
        }}
        style={styles.banner}
      />
      <View style={styles.overlay}>
        <MaterialCommunityIcons name="trophy" size={22} color="#FFD166" />
        <Text style={styles.title}>Interclasse Digital</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  banner: {
    width: '100%',
    height: 130,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 18, 43, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
