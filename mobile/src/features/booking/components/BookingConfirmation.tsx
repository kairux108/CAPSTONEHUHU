
import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  BookingDraft,
} from '../types/booking.types';

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

type Props = {
  draft: BookingDraft;
  onReasonChange: (reason: string) => void;
};

export default function BookingConfirmation({
  draft,
  onReasonChange,
}: Props) {
  return (
    <View>
      <Text style={styles.heading}>
        Review your appointment
      </Text>

      <View style={styles.card}>
        <Detail
          label="Doctor"
          value={
            draft.doctor?.name ??
            'Not selected'
          }
        />

        <Detail
          label="Specialty"
          value={
            draft.doctor?.specialty ??
            '—'
          }
        />

        <Detail
          label="Date"
          value={draft.date || '—'}
        />

        <Detail
          label="Time"
          value={draft.time || '—'}
        />
      </View>

      <Text style={styles.heading}>
        Reason for visit (optional)
      </Text>

      <TextInput
        multiline
        maxLength={1000}
        value={draft.reason}
        onChangeText={onReasonChange}
        placeholder="Briefly describe your reason for visiting"
        placeholderTextColor="#98A4B1"
        style={styles.input}
        textAlignVertical="top"
      />

      <Text style={styles.notice}>
        Preview only: this step will not
        create a real appointment until
        the patient booking API is implemented.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#12172A',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E2E8EE',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: '#D7DCE5',
  },

  label: {
    fontSize: 13,
    color: '#5B6577',
  },

  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12172A',
    flexShrink: 1,
    textAlign: 'right',
  },

  input: {
    backgroundColor: '#FFF',
    minHeight: 100,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D7DCE5',
    fontSize: 14,
    color: '#12172A',
  },

  notice: {
    backgroundColor: '#E1F7F3',
    color: '#0B6E62',
    padding: 14,
    borderRadius: 13,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },
});
