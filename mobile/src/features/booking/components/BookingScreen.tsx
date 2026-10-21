import React from 'react';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DoctorCard from './DoctorCard';
import CalendarPicker from './CalendarPicker';
import TimeSlotButton from './TimeSlotButton';
import BookingConfirmation from './BookingConfirmation';

import {
  useBooking,
} from '../hooks/useBooking';


const TITLES = [
  'Choose a Doctor',
  'Date & Time',
  'Confirm Details',
  'Appointment Confirmed',
];

export default function BookingScreen() {
  const booking = useBooking();

  const {
    step,
    draft,
    doctors,
    specialty,
    specialties,
    slots,
    loadingDoctors,
    loadingSlots,
    doctorsError,
    slotsError,
    submitting,
    submitError,
    bookingConfirmation,
  } = booking;

  const canContinue =
    step === 1
      ? Boolean(draft.doctor)
      : step === 2
        ? Boolean(
            draft.date &&
            draft.time &&
            !loadingSlots &&
            !slotsError &&
            slots.some(
              slot =>
                slot.time === draft.time &&
                slot.available
            )
          )
        : booking.canReview;

  const handleContinue = async () => {
    if (step === 4) {
      booking.reset();
      return;
    }

    if (
      step === 3 &&
      !booking.canReview
    ) {
      Alert.alert(
        'Incomplete details',
        'Please check your appointment details.'
      );

      return;
    }

    if (step === 3) {
      await booking.submitBooking();
      return;
    }

    booking.next();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          CURA • APPOINTMENTS
        </Text>

        <Text style={styles.title}>
          {TITLES[step - 1]}
        </Text>

        <View style={styles.progress}>
          {[1, 2, 3, 4].map(number => (
            <View
              key={number}
              style={[
                styles.segment,
                number <= step &&
                  styles.segmentActive,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.demo}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#8A5900"
          />

          <Text style={styles.demoText}>
            Doctors and times are loaded from CURA.
            Confirming an appointment will save it to the system.
          </Text>
        </View>

        {step === 1 && (
          <>
            <Text style={styles.section}>
              Choose a specialty
            </Text>

            <View style={styles.chips}>
              {specialties.map(item => {
                const active =
                  specialty === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => {
                      booking.setSpecialty(item);

                      if (
                        draft.doctor &&
                        item !== 'All' &&
                        draft.doctor.specialty !== item
                      ) {
                        booking.clearDoctor();
                      }
                    }}
                    style={[
                      styles.chip,
                      active && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active &&
                          styles.chipTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.section}>
              Select a doctor
            </Text>

            {loadingDoctors && (
              <Text style={styles.feedback}>
                Loading doctors...
              </Text>
            )}

            {doctorsError && (
              <Pressable
                onPress={booking.retryDoctors}
                style={styles.feedbackBox}
              >
                <Text style={styles.errorText}>
                  {doctorsError} Tap to retry.
                </Text>
              </Pressable>
            )}

            {!loadingDoctors &&
              !doctorsError &&
              doctors.length === 0 && (
                <Text style={styles.feedback}>
                  No doctors available for this specialty.
                </Text>
              )}

            {doctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                selected={
                  draft.doctor?.id === doctor.id
                }
                onPress={() =>
                  booking.selectDoctor(doctor)
                }
              />
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.summary}>
              Provider: {draft.doctor?.name}
            </Text>

            <CalendarPicker
              value={draft.date}
              onChange={booking.selectDate}
            />

            <Text
              style={[
                styles.section,
                { marginTop: 25 },
              ]}
            >
              Select a time
            </Text>

            {!draft.date && (
              <Text style={styles.feedback}>
                Choose a date to see appointment times.
              </Text>
            )}

            {loadingSlots && (
              <Text style={styles.feedback}>
                Loading available appointment times...
              </Text>
            )}

            {slotsError && (
              <Text style={styles.errorText}>
                {slotsError}
              </Text>
            )}

            {draft.date &&
              !loadingSlots &&
              !slotsError &&
              slots.length === 0 && (
                <Text style={styles.feedback}>
                  No appointment times available for this date.
                </Text>
              )}

            <View style={styles.slots}>
              {slots.map(slot => (
                <TimeSlotButton
                  key={slot.time}
                  time={slot.time}
                  available={slot.available}
                  selected={
                    draft.time === slot.time
                  }
                  onPress={() =>
                    booking.selectTime(slot.time)
                  }
                />
              ))}
            </View>
          </>
        )}

        {step === 3 && submitError && (
          <View style={styles.feedbackBox}>
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        )}

        {step === 3 && (
          <BookingConfirmation
            draft={draft}
            onReasonChange={
              booking.setReason
            }
          />
        )}

        {step === 4 && bookingConfirmation && (
          <View style={styles.done}>
            <Ionicons
              name="checkmark-circle-outline"
              size={76}
              color="#12A594"
            />

            <Text style={styles.doneTitle}>
              Appointment Confirmed!
            </Text>

            <Text style={styles.doneText}>
              Your appointment was saved in CURA.
              Keep your appointment number for reference.
            </Text>

            <View style={styles.previewCard}>
              <Text style={styles.previewText}>
                {draft.doctor?.name}
              </Text>

              <Text style={styles.previewText}>
                {draft.date} at {draft.time}
              </Text>
              <Text style={styles.previewText}>
                Appointment No: {bookingConfirmation.appointment_number}
              </Text>
              <Text style={styles.previewText}>
                Status: {bookingConfirmation.status}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && step < 4 && (
          <Pressable
            style={styles.secondary}
            onPress={booking.back}
            disabled={submitting}
          >
            <Text style={styles.secondaryText}>
              Back
            </Text>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.primary,
            step !== 4 &&
              (!canContinue || submitting) &&
              styles.primaryDisabled,
          ]}
          disabled={
            submitting || (step !== 4 && !canContinue)
          }
          onPress={handleContinue}
        >
          <Text style={styles.primaryText}>
            {step === 4
              ? 'Start Again'
              : step === 3
                ? submitting ? 'Confirming...' : 'Confirm Appointment'
                : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EFF9F6',
  },

  header: {
    backgroundColor: '#0B796D',
    paddingHorizontal: 23,
    paddingTop: 25,
    paddingBottom: 23,
  },

  eyebrow: {
    color: '#CBF7F0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 7,
  },

  progress: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 19,
  },

  segment: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#549D94',
  },

  segmentActive: {
    backgroundColor: '#FFF',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 125,
  },

  demo: {
    flexDirection: 'row',
    gap: 9,
    padding: 13,
    borderRadius: 13,
    backgroundColor: '#FFF2D6',
    marginBottom: 21,
  },

  demoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#8A5900',
    fontWeight: '600',
  },

  section: {
    fontSize: 16,
    fontWeight: '800',
    color: '#12172A',
    marginBottom: 13,
  },

  chips: {
    flexDirection: 'row',
    gap: 7,
    flexWrap: 'wrap',
    marginBottom: 24,
  },

  chip: {
    backgroundColor: '#FFF',
    borderColor: '#D7DCE5',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  chipActive: {
    backgroundColor: '#12A594',
    borderColor: '#12A594',
  },

  chipText: {
    color: '#5B6577',
    fontSize: 12,
    fontWeight: '700',
  },

  chipTextActive: {
    color: '#FFF',
  },

  summary: {
    fontSize: 13,
    color: '#0B6E62',
    fontWeight: '700',
    marginBottom: 18,
  },

  feedback: {
    color: '#5B6577',
    fontSize: 13,
    marginBottom: 14,
  },

  feedbackBox: {
    padding: 12,
    backgroundColor: '#FFF1F0',
    borderRadius: 10,
    marginBottom: 14,
  },

  errorText: {
    color: '#B42318',
    fontSize: 13,
    marginBottom: 14,
  },

  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 78,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 9,
    backgroundColor: '#EFF9F6',
  },

  primary: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 13,
    padding: 15,
    backgroundColor: '#0B796D',
  },

  primaryDisabled: {
    backgroundColor: '#A9C6C0',
  },

  primaryText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },

  secondary: {
    borderWidth: 1.5,
    borderColor: '#0B796D',
    paddingHorizontal: 19,
    paddingVertical: 14,
    borderRadius: 13,
  },

  secondaryText: {
    color: '#0B796D',
    fontWeight: '700',
  },

  done: {
    alignItems: 'center',
    marginTop: 35,
    paddingHorizontal: 15,
  },

  doneTitle: {
    fontSize: 20,
    color: '#12172A',
    fontWeight: '800',
    marginTop: 15,
    textAlign: 'center',
  },

  doneText: {
    fontSize: 14,
    color: '#5B6577',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
  },

  previewCard: {
    backgroundColor: '#FFF',
    borderRadius: 17,
    padding: 18,
    alignSelf: 'stretch',
    marginTop: 23,
    gap: 8,
  },

  previewText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    color: '#12172A',
  },
});
