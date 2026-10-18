import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

export default function LoginHeader() {
  return (
    <LinearGradient
      colors={[
        Colors.primary,
        Colors.primaryDark,
      ]}
      style={styles.header}
    >
      <View style={styles.circleLeft} />
      <View style={styles.circleRight} />

      <View style={styles.logo}>
        <Ionicons
          name="add"
          size={40}
          color={Colors.white}
        />
      </View>

      <Text style={styles.brand}>CURA</Text>

      <Text style={styles.tagline}>
        HEALTH COMPANION
      </Text>

      <Text style={styles.subtag}>
        Your health, our priority
      </Text>

      <View style={styles.wave} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 38,
    overflow: 'hidden',
  },

  circleLeft: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor:
      'rgba(255,255,255,0.08)',
    top: -70,
    left: -60,
  },

  circleRight: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor:
      'rgba(255,255,255,0.06)',
    right: -50,
    bottom: -40,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor:
      'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  brand: {
    color: Colors.white,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 4,
  },

  tagline: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    opacity: 0.85,
    marginTop: 4,
  },

  subtag: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.9,
    marginTop: 16,
  },

  wave: {
    position: 'absolute',
    width: '130%',
    height: 65,
    borderRadius: 999,
    backgroundColor: Colors.background,
    bottom: -48,
  },
});