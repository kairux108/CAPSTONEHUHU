
import type {
  BookingDraft,
} from '../types/booking.types';

export function localDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isValidBooking(
  draft: BookingDraft
): boolean {
  if (
    !draft.doctor ||
    !draft.date ||
    !draft.time
  ) {
    return false;
  }

  const day = new Date(
    `${draft.date}T00:00:00`
  );

  if (
    Number.isNaN(day.getTime()) ||
    localDateKey(day) !== draft.date
  ) {
    return false;
  }

  if (draft.date < localDateKey(new Date())) {
    return false;
  }

  const validTime =
    /^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time);

  const validReason =
    draft.reason.trim().length <= 1000;

  return validTime && validReason;
}
