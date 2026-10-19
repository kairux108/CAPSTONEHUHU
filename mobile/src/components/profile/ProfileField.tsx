import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

export default function ProfileField({
  icon,
  label,
  value,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Ionicons
          name={icon}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E1F7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  content: {
    flex: 1,
  },

  label: {
    fontSize: 10.5,
    color: Colors.muted,
  },

  value: {
    marginTop: 2,
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.text,
  },
});