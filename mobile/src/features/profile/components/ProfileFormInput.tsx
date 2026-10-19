import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Colors } from '../../../constants/colors';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
} & Pick<
  TextInputProps,
  'autoCapitalize' | 'keyboardType' | 'multiline'
>;

export default function ProfileFormInput({
  label,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  autoCapitalize = 'words',
  multiline = false,
}: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error ? styles.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        accessibilityLabel={label}
        accessibilityHint={error}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.muted,
    marginBottom: 6,
  },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
  },

  inputError: {
    borderColor: Colors.danger,
  },

  fieldError: {
    color: Colors.danger,
    fontSize: 11,
    marginTop: 5,
    marginBottom: 6,
  },

  multiline: {
    minHeight: 85,
    paddingTop: 12,
  },
});
