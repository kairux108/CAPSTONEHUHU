import { Ionicons } from '@expo/vector-icons';

import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Colors } from '../../constants/colors';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
};

export default function IconCircleButton({
  icon,
  onPress,
  size = 19,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.button}
    >
      <Ionicons
        name={icon}
        size={size}
        color={Colors.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,

    backgroundColor: Colors.white,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 6,

    elevation: 3,
  },
});