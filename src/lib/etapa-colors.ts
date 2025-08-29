export const etapaColors: { [key: string]: string } = {
  'Etapa 1': '#9D17EB', // Primary
  'Etapa 2': '#7C3AED', // Accent
  'Etapa 3': '#5B21B6', // A darker purple
  'Etapa 4': '#C026D3', // A more magenta purple
  // Add more stages and colors as needed
};

export const getEtapaColor = (etapa: string): string => {
  return etapaColors[etapa] || '#A8A29E'; // Return gray for unknown etapas
};
