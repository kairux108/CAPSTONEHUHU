
import React, {
  useMemo,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  localDateKey,
} from '../validation/bookingValidation';

type Props = {
  value: string;
  onChange: (date: string) => void;
};

export default function CalendarPicker({
  value,
  onChange,
}: Props) {
  const days = useMemo(() => {
    return Array.from(
      { length: 14 },
      (_, offset) => {
        const day = new Date();

        day.setHours(12, 0, 0, 0);
        day.setDate(day.getDate() + offset);

        return {
          key: localDateKey(day),

          weekday: day.toLocaleDateString(
            'en-US',
            { weekday: 'short' }
          ),

          date: day.getDate(),

          month: day.toLocaleDateString(
            'en-US',
            { month: 'short' }
          ),
        };
      }
    );
  }, []);

  return (
    <View>
      <Text style={styles.label}>
        Choose a date
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {days.map(day => {
          const selected =
            value === day.key;

          return (
            <Pressable
              key={day.key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() =>
                onChange(day.key)
              }
              style={[
                styles.day,
                selected && styles.selected,
              ]}
            >
              <Text
                style={[
                  styles.small,
                  selected && styles.white,
                ]}
              >
                {day.weekday}
              </Text>

              <Text
                style={[
                  styles.number,
                  selected && styles.white,
                ]}
              >
                {day.date}
              </Text>

              <Text
                style={[
                  styles.small,
                  selected && styles.white,
                ]}
              >
                {day.month}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#12172A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },

  row: {
    paddingVertical: 3,
    gap: 8,
  },

  day: {
    width: 63,
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#D7DCE5',
    alignItems: 'center',
  },

  selected: {
    backgroundColor: '#12A594',
    borderColor: '#12A594',
  },

  small: {
    fontSize: 11,
    color: '#5B6577',
    fontWeight: '600',
  },

  number: {
    fontSize: 20,
    fontWeight: '800',
    color: '#12172A',
    marginVertical: 4,
  },

  white: {
    color: '#FFF',
  },
});
