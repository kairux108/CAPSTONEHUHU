
import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

type Props = {
  time: string;
  available: boolean;
  selected: boolean;
  onPress: () => void;
};

export default function TimeSlotButton({
  time,
  available,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: !available,
        selected,
      }}
      disabled={!available}
      onPress={onPress}
      style={[
        styles.slot,
        selected && styles.selected,
        !available && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.text,
          selected && styles.selectedText,
          !available && styles.disabledText,
        ]}
      >
        {time}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: '31%',
    paddingVertical: 13,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D7DCE5',
    marginBottom: 9,
  },

  selected: {
    backgroundColor: '#E1F7F3',
    borderColor: '#12A594',
  },

  disabled: {
    backgroundColor: '#F6F7F9',
    borderColor: '#ECEEF1',
  },

  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12172A',
  },

  selectedText: {
    color: '#0B6E62',
  },

  disabledText: {
    color: '#BBC2CE',
    textDecorationLine: 'line-through',
  },
});
