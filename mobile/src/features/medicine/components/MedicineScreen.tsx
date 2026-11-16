
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../../constants/colors';
import useMedications from '../hooks/useMedications';
import type { PatientMedication } from '../services/medicationService';

function formatDate(value: string | null): string {
  if (!value) return 'Not specified';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not specified';
  }

  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getSchedule(medication: PatientMedication): string {
  if (
    medication.schedule_type === 'fixed' &&
    medication.administration_times?.length
  ) {
    return `Prescribed times: ${medication.administration_times.join(', ')}`;
  }

  if (
    medication.schedule_type === 'interval' &&
    medication.interval_hours
  ) {
    const scope =
      medication.interval_scope === 'while_awake'
        ? 'while awake'
        : medication.interval_scope === 'around_clock'
          ? 'including overnight'
          : null;

    return `Every ${medication.interval_hours} hours${
      scope ? ` (${scope})` : ''
    }`;
  }

  if (medication.schedule_type === 'meal') {
    const relations: Record<string, string> = {
      before: 'Before meals',
      with: 'With meals',
      after: 'After meals',
    };

    return medication.meal_relation
      ? relations[medication.meal_relation] ??
          'Meal-based schedule'
      : 'Meal-based schedule';
  }

  if (medication.schedule_type === 'custom') {
    return 'Doctor-defined schedule';
  }

  return 'Schedule not specified';
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>
        {value === null || value === undefined || value === ''
          ? 'Not specified'
          : String(value)}
      </Text>
    </View>
  );
}

export default function MedicineScreen() {
  const {
    medications,
    loading,
    error,
    refreshMedications,
  } = useMedications();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshMedications}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Medications</Text>
        <Text style={styles.subtitle}>
          View your issued prescriptions and
          doctor-provided medication schedules.
        </Text>
      </View>

      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>
            Prescribed Medications
          </Text>
          <Text style={styles.summaryCount}>
            {loading ? '—' : medications.length}
          </Text>
        </View>

        <Pressable
          onPress={refreshMedications}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Refresh medications"
          style={styles.refreshButton}
        >
          <Text style={styles.refreshText}>
            Refresh
          </Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />
          <Text style={styles.muted}>
            Loading your medications...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.messageCard}>
          <Text style={styles.errorTitle}>
            Unable to load medications
          </Text>
          <Text style={styles.muted}>{error}</Text>

          <Pressable
            onPress={refreshMedications}
            accessibilityRole="button"
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && medications.length === 0 && (
        <View style={styles.messageCard}>
          <Text style={styles.emptyTitle}>
            No issued medications found
          </Text>
          <Text style={styles.muted}>
            Medications from your issued prescriptions
            will appear here.
          </Text>
        </View>
      )}

      {!loading && !error && medications.map((medication) => (
        <View
          key={medication.id}
          style={styles.medicationCard}
        >
          <View style={styles.cardHeader}>
            <View style={styles.nameContainer}>
              <Text style={styles.medicineName}>
                {medication.medicine}
              </Text>
              <Text style={styles.strength}>
                {medication.strength || 'Strength not specified'}
              </Text>
            </View>

            {medication.as_needed && (
              <View style={styles.prnBadge}>
                <Text style={styles.prnText}>
                  As needed
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <Detail label="Dosage" value={medication.dosage} />
          <Detail label="Frequency" value={medication.frequency} />

          <Detail
            label="Duration"
            value={
              medication.duration ||
              (medication.duration_days
                ? `${medication.duration_days} days`
                : null)
            }
          />

          <View style={styles.scheduleBox}>
            <Text style={styles.scheduleLabel}>
              Doctor-Prescribed Schedule
            </Text>
            <Text style={styles.scheduleText}>
              {getSchedule(medication)}
            </Text>
          </View>

          {medication.timing_instructions && (
            <Detail
              label="Timing Instructions"
              value={medication.timing_instructions}
            />
          )}

          {medication.instructions && (
            <Detail
              label="Medication Instructions"
              value={medication.instructions}
            />
          )}

          <View style={styles.divider} />

          <Text style={styles.prescriptionInfo}>
            Prescription #{medication.prescription_id}
            {' · '}
            Issued {formatDate(medication.issued_at)}
          </Text>
        </View>
      ))}

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Medication schedules are displayed as provided
          by your doctor. This page does not track doses
          taken or determine when a medication is due.
          Follow your prescriber&apos;s instructions.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 120,
    gap: 16,
  },
  header: {
    gap: 7,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.muted,
  },
  summary: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.muted,
  },
  summaryCount: {
    fontSize: 27,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 17,
    paddingVertical: 11,
  },
  refreshText: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
    gap: 12,
    padding: 35,
  },
  muted: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: Colors.surface,
    padding: 25,
    borderRadius: 18,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  errorTitle: {
    color: Colors.danger,
    fontWeight: '700',
    fontSize: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  retryText: {
    color: Colors.white,
    fontWeight: '700',
  },
  medicationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameContainer: {
    flex: 1,
    gap: 4,
  },
  medicineName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  strength: {
    fontSize: 12,
    color: Colors.muted,
  },
  prnBadge: {
    backgroundColor: Colors.warningBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  prnText: {
    color: Colors.warning,
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  detail: {
    gap: 4,
  },
  detailLabel: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  detailValue: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 19,
  },
  scheduleBox: {
    padding: 14,
    backgroundColor: Colors.background,
    borderRadius: 12,
    gap: 6,
  },
  scheduleLabel: {
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
  },
  scheduleText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
  prescriptionInfo: {
    color: Colors.muted,
    fontSize: 11,
  },
  notice: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: Colors.surface,
  },
  noticeText: {
    color: Colors.muted,
    fontSize: 11,
    lineHeight: 18,
  },
});
