/* utils/formatDate.ts */

export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(d);
};

export const formatDateTime = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Data/Hora inválida";

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};