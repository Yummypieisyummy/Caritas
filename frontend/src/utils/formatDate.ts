export const formatUIDate = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return '—'; // Handle empty values gracefully

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Your fallback for invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
