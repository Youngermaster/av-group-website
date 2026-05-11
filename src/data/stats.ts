export interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 20, suffix: '+', label: 'Años desarrollando lujo' },
  { value: 17, suffix: '', label: 'Proyectos en portafolio' },
  { value: 5, suffix: '', label: 'Categorías curadas' },
  { value: 1, suffix: '', label: 'Visión holística' },
];
