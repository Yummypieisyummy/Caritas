export const formatUIDate = (isoString: string): string => {
  const date = new Date(isoString);

  // Fallback in case the API sends an invalid or empty string
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
