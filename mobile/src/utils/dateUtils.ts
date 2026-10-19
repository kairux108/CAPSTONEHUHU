export function calculateAge(
  birthDate: Date | null
): number | null {
  if (!birthDate) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
}

export function formatDate(
  date: Date
): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatLongDate(
  dateString: string | null | undefined
): string {
  if (!dateString) {
    return 'Not provided';
  }

  const match = dateString.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) {
    return 'Not provided';
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (Number.isNaN(date.getTime())) {
    return 'Not provided';
  }

  return new Intl.DateTimeFormat(
    'en-PH',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  ).format(date);
}