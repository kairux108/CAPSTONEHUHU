import { Ionicons } from '@expo/vector-icons';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

import CuraCard from '../common/CuraCard';
import SectionHeader from '../common/SectionHeader';

export type MedicationSummary = {
  id: number;
  name: string;
  dosage: string;
  schedule: string;
  status: 'taken' | 'pending' | 'missed';
};

type Props = {
  medications: MedicationSummary[];
  onSeeAllPress: () => void;
  onMedicationPress?: (
    medication: MedicationSummary
  ) => void;
};

function getStatusLabel(
  status: MedicationSummary['status']
) {
  if (status === 'taken') {
    return 'Taken';
  }

  if (status === 'missed') {
    return 'Missed';
  }

  return 'Pending';
}

export default function TodayMedicationsCard({
  medications,
  onSeeAllPress,
  onMedicationPress,
}: Props) {
  return (
    <View>
      <SectionHeader
        title="Today's Medications"
        actionLabel="See all"
        onActionPress={onSeeAllPress}
      />

      <CuraCard>
        {medications.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="medkit-outline"
                size={25}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No medicines scheduled
            </Text>

            <Text style={styles.emptyText}>
              Your prescribed medicines and
              schedules will appear here.
            </Text>
          </View>
        ) : (
          medications.map((medication, index) => (
            <TouchableOpacity
              key={medication.id}
              activeOpacity={0.8}
              onPress={() =>
                onMedicationPress?.(medication)
              }
              style={[
                styles.medicationRow,
                index === medications.length - 1 &&
                  styles.lastRow,
              ]}
            >
              <View style={styles.medicationIcon}>
                <Ionicons
                  name="medical-outline"
                  size={21}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.medicationInfo}>
                <Text
                  style={styles.medicationName}
                  numberOfLines={1}
                >
                  {medication.name}
                </Text>

                <Text
                  style={styles.medicationDetails}
                  numberOfLines={1}
                >
                  {medication.dosage}
                  {' · '}
                  {medication.schedule}
                </Text>
              </View>

              <View style={styles.rightSide}>
                <View
                  style={[
                    styles.statusBadge,

                    medication.status === 'taken' &&
                      styles.takenBadge,

                    medication.status === 'pending' &&
                      styles.pendingBadge,

                    medication.status === 'missed' &&
                      styles.missedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,

                      medication.status === 'taken' &&
                        styles.takenText,

                      medication.status === 'pending' &&
                        styles.pendingText,

                      medication.status === 'missed' &&
                        styles.missedText,
                    ]}
                  >
                    {getStatusLabel(
                      medication.status
                    )}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={Colors.muted}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </CuraCard>
    </View>
  );
}

const styles = StyleSheet.create({
  medicationRow: {
    minHeight: 64,

    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,

    backgroundColor: '#E1F7F3',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  medicationInfo: {
    flex: 1,
    paddingRight: 8,
  },

  medicationName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },

  medicationDetails: {
    fontSize: 11.5,
    color: Colors.muted,
    marginTop: 3,
  },

  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  takenBadge: {
    backgroundColor:
      Colors.successBackground,
  },

  pendingBadge: {
    backgroundColor:
      Colors.warningBackground,
  },

  missedBadge: {
    backgroundColor:
      Colors.dangerBackground,
  },

  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },

  takenText: {
    color: Colors.success,
  },

  pendingText: {
    color: Colors.warning,
  },

  missedText: {
    color: Colors.danger,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 13,
  },

  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,

    backgroundColor: '#E1F7F3',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.muted,

    textAlign: 'center',

    marginTop: 4,
    paddingHorizontal: 20,
  },
});