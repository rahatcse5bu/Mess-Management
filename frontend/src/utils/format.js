export const formatDate = (value) => {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
};

export const formatAmount = (value) => Number(value || 0).toFixed(2);
