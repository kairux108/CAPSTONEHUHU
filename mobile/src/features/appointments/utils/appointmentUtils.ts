export type AppointmentStatusType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export function getDoctorInitials(
  name: string
): string {
  const cleaned = name
    .replace(/^Dr\.?\s*/i, '')
    .trim();

  const parts = cleaned
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'DR';
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

export function formatAppointmentLabel(
  value: string
): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter =>
      letter.toUpperCase()
    );
}

export function formatAppointmentDate(
  value: string
): string {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) {
    return value;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return value;
  }

  return `${months[month - 1]} ${day}, ${year}`;
}

export function formatAppointmentTime(
  value: string
): string {
  const [hourValue, minuteValue] =
    value.split(':');

  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return value;
  }

  const period =
    hour >= 12 ? 'PM' : 'AM';

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}:${String(
    minute
  ).padStart(2, '0')} ${period}`;
}

export function getAppointmentStatusType(
  status: string
): AppointmentStatusType {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'checked_in':
      return 'success';

    case 'cancelled':
    case 'canceled':
      return 'danger';

    case 'pending':
      return 'warning';

    default:
      return 'info';
  }
}

export function showAppointmentCheck(
  status: string
): boolean {
  const normalized =
    status.toLowerCase();

  return (
    normalized === 'completed' ||
    normalized === 'checked_in'
  );
}