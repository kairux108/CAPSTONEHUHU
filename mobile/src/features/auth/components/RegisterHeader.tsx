import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../../constants/colors';

export default function RegisterHeader() {
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

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={Colors.white}
        />
      </TouchableOpacity>

      <View style={styles.logo}>
        <Ionicons
          name="add"
          size={34}
          color={Colors.white}
        />
      </View>

      <Text style={styles.brand}>CURA</Text>

      <Text style={styles.tagline}>
        HEALTH COMPANION
      </Text>

      <View style={styles.wave} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 245,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 35,
    overflow: 'hidden',
  },

  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor:
      'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleLeft: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor:
      'rgba(255,255,255,0.08)',
    top: -80,
    left: -60,
  },

  circleRight: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor:
      'rgba(255,255,255,0.06)',
    right: -50,
    bottom: -30,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor:
      'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  brand: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
  },

  tagline: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    opacity: 0.85,
    marginTop: 4,
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