
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import useRecords from '../hooks/useRecords';

const formatDate = (value: string | null) => {
  if (!value) return 'Not recorded';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not recorded';
  }

  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const RecordField = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>

    <Text style={styles.fieldValue}>
      {value?.trim() || 'Not recorded'}
    </Text>
  </View>
);

export default function RecordsScreen() {
  const {
    records,
    loading,
    error,
    page,
    totalPages,
    total,
    nextPage,
    previousPage,
    refresh,
  } = useRecords();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Medical Records</Text>

        <Text style={styles.subtitle}>
          View your completed consultations, diagnoses,
          care instructions, and issued prescriptions.
        </Text>
      </View>

      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>
            Completed Consultations
          </Text>

          <Text style={styles.summaryValue}>
            {loading && records.length === 0 ? '—' : total}
          </Text>
        </View>

        <Pressable
          onPress={refresh}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Refresh medical records"
          style={[
            styles.refreshButton,
            loading && styles.disabled,
          ]}
        >
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#159B83" />

          <Text style={styles.muted}>
            Loading your medical records...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            Unable to load medical records
          </Text>

          <Text style={styles.errorText}>{error}</Text>

          <Pressable onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && records.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No medical records yet
          </Text>

          <Text style={styles.muted}>
            Your completed consultations will appear here
            once they become available.
          </Text>
        </View>
      )}

      {!loading && !error && records.map((record) => (
        <View
          key={record.consultation_id}
          style={styles.recordCard}
        >
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle}>
              Consultation #{record.consultation_id}
            </Text>

            <Text style={styles.dateText}>
              {formatDate(record.completed_at)}
            </Text>
          </View>

          <RecordField
            label="Attending Doctor"
            value={record.doctor_name}
          />

          <RecordField
            label="Diagnosis"
            value={record.diagnosis?.name}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Care Plan
          </Text>

          <RecordField
            label="Care Instructions"
            value={record.care_instructions}
          />

          <RecordField
            label="Follow-up Instructions"
            value={record.follow_up_instructions}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Prescription
          </Text>

          {!record.prescription ? (
            <Text style={styles.muted}>
              No issued prescription for this consultation.
            </Text>
          ) : (
            <View>
              <RecordField
                label="Date Issued"
                value={formatDate(
                  record.prescription.issued_at
                )}
              />

              {record.prescription.medications.map(
                (medicine, index) => (
                  <View
                    key={`${record.prescription?.id}-${index}`}
                    style={styles.medicineCard}
                  >
                    <Text style={styles.medicineName}>
                      {medicine.medicine}
                    </Text>

                    <RecordField
                      label="Strength"
                      value={medicine.strength}
                    />

                    <RecordField
                      label="Dosage"
                      value={medicine.dosage}
                    />

                    <RecordField
                      label="Frequency"
                      value={medicine.frequency}
                    />

                    <RecordField
                      label="Duration"
                      value={
                        medicine.duration ||
                        (medicine.duration_days
                          ? `${medicine.duration_days} days`
                          : null)
                      }
                    />

                    <RecordField
                      label="Instructions"
                      value={medicine.instructions}
                    />
                  </View>
                )
              )}
            </View>
          )}
        </View>
      ))}

      {!loading && !error && totalPages > 1 && (
        <View style={styles.pagination}>
          <Pressable
            disabled={page <= 1}
            onPress={previousPage}
            style={[
              styles.pageButton,
              page <= 1 && styles.disabled,
            ]}
          >
            <Text style={styles.pageButtonText}>
              Previous
            </Text>
          </Pressable>

          <Text style={styles.pageText}>
            {page} of {totalPages}
          </Text>

          <Pressable
            disabled={page >= totalPages}
            onPress={nextPage}
            style={[
              styles.pageButton,
              page >= totalPages && styles.disabled,
            ]}
          >
            <Text style={styles.pageButtonText}>
              Next
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F7',
  },

  content: {
    padding: 18,
    paddingBottom: 40,
    gap: 16,
  },

  header: {
    gap: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#24413C',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#68817A',
  },

  summary: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    fontSize: 13,
    color: '#68817A',
  },

  summaryValue: {
    marginTop: 5,
    fontSize: 26,
    fontWeight: '800',
    color: '#159B83',
  },

  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#159B83',
  },

  refreshText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  center: {
    paddingVertical: 35,
    alignItems: 'center',
    gap: 12,
  },

  muted: {
    fontSize: 13,
    lineHeight: 20,
    color: '#788A85',
  },

  errorCard: {
    padding: 18,
    backgroundColor: '#FFF1F1',
    borderRadius: 14,
    gap: 10,
  },

  errorTitle: {
    fontWeight: '700',
    color: '#A32B2B',
  },

  errorText: {
    fontSize: 13,
    color: '#A32B2B',
  },

  retryButton: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 9,
    backgroundColor: '#A32B2B',
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  emptyCard: {
    padding: 25,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#24413C',
  },

  recordCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#DDEBE6',
  },

  recordHeader: {
    gap: 5,
  },

  recordTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#24413C',
  },

  dateText: {
    fontSize: 12,
    color: '#68817A',
  },

  field: {
    gap: 4,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#68817A',
  },

  fieldValue: {
    fontSize: 14,
    lineHeight: 21,
    color: '#344D47',
  },

  divider: {
    height: 1,
    backgroundColor: '#E3EEE9',
    marginVertical: 3,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#24413C',
  },

  medicineCard: {
    backgroundColor: '#EAF7F1',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },

  medicineName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#176B58',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  pageButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#159B83',
    borderRadius: 10,
  },

  pageButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  pageText: {
    color: '#344D47',
    fontWeight: '600',
  },

  disabled: {
    opacity: 0.4,
  },
});
