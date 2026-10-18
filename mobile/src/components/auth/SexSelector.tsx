import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SexSelector({
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        Sex
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.option,
            value === 'male' &&
              styles.selected,
          ]}
          onPress={() =>
            onChange('male')
          }
        >
          <Text
            style={[
              styles.text,
              value === 'male' &&
                styles.selectedText,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            value === 'female' &&
              styles.selected,
          ]}
          onPress={() =>
            onChange('female')
          }
        >
          <Text
            style={[
              styles.text,
              value === 'female' &&
                styles.selectedText,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>
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

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  option: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor:
      Colors.insetBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selected: {
    borderColor: Colors.primary,
    backgroundColor: '#E1F7F3',
  },

  text: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.muted,
  },

  selectedText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
