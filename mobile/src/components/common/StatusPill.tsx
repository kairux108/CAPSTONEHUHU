import { Ionicons } from '@expo/vector-icons';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

type StatusType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

type Props = {
  label: string;
  type?: StatusType;
  showCheck?: boolean;
};

export default function StatusPill({
  label,
  type = 'info',
  showCheck = false,
}: Props) {
  const backgroundColor = {
    success: Colors.successBackground,
    warning: Colors.warningBackground,
    danger: Colors.dangerBackground,
    info: '#E1F7F3',
  }[type];

  const textColor = {
    success: Colors.success,
    warning: Colors.warning,
    danger: Colors.danger,
    info: Colors.primary,
  }[type];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
      ]}
    >
      {showCheck ? (
        <Ionicons
          name="checkmark"
          size={12}
          color={textColor}
        />
      ) : null}

      <Text
        style={[
          styles.text,
          { color: textColor },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 20,
  },

  text: {
    fontSize: 11.5,
    fontWeight: '700',
  },
});