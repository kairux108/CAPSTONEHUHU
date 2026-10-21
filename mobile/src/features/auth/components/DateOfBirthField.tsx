import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../../constants/colors';
import { formatDate } from '../../../utils/dateUtils';

type Props = {
  value: Date | null;
  onChange: (date: Date) => void;
};

export default function DateOfBirthField({
  value,
  onChange,
}: Props) {
  const [showPicker, setShowPicker] =
    useState(false);

  const handleValueChange = (
    _event: unknown,
    selectedDate: Date
  ) => {
    onChange(selectedDate);

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
  };

  const handleDismiss = () => {
    setShowPicker(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        Date of Birth
      </Text>

      <TouchableOpacity
        style={styles.field}
        activeOpacity={0.8}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name="calendar-outline"
          size={19}
          color={Colors.muted}
        />

        <Text
          style={[
            styles.value,
            !value && styles.placeholder,
          ]}
        >
          {value
            ? formatDate(value)
            : 'Select your date of birth'}
        </Text>

        <Ionicons
          name="chevron-down"
          size={18}
          color={Colors.muted}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={
            value ??
            new Date(2000, 0, 1)
          }
          mode="date"
          maximumDate={new Date()}
          minimumDate={
            new Date(1900, 0, 1)
          }
          onValueChange={
            handleValueChange
          }
          onDismiss={handleDismiss}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },

  field: {
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor:
      Colors.insetBackground,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  value: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },

  placeholder: {
    color: '#9CA3AF',
  },
});