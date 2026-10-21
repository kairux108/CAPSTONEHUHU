
import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import type {
  BookingDoctor,
} from '../types/booking.types';

type Props = {
  doctor: BookingDoctor;
  selected: boolean;
  onPress: () => void;
};

export default function DoctorCard({
  doctor,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.selected,
      ]}
    >
      <View style={styles.avatar}>
        <Ionicons
          name="person-outline"
          size={25}
          color="#0B6E62"
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>
          {doctor.name}
        </Text>

        <Text style={styles.specialty}>
          {doctor.specialty}
        </Text>

        {!!doctor.description && (
          <Text style={styles.note}>
            {doctor.description}
          </Text>
        )}
      </View>

      <Ionicons
        name={
          selected
            ? 'checkmark-circle'
            : 'ellipse-outline'
        }
        size={23}
        color={
          selected
            ? '#12A594'
            : '#B8C5C2'
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D7DCE5',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },

  selected: {
    borderColor: '#12A594',
    backgroundColor: '#E6FAF7',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#DDF4F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  details: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#12172A',
  },

  specialty: {
    marginTop: 3,
    fontSize: 13,
    color: '#5B6577',
  },

  note: {
    marginTop: 3,
    fontSize: 11,
    color: '#7A8790',
  },
});
