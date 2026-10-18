import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Colors } from '../../constants/colors';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={styles.button}
    >
      <LinearGradient
        colors={
          disabled
            ? ['#C9CEDA', '#C9CEDA']
            : [Colors.primary, Colors.primaryDark]
        }
        style={styles.gradient}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },

  gradient: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});