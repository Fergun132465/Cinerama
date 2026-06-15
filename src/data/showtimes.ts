export interface ShowtimeDay {
  label: string;
  num: string;
  mes: string;
}

export interface ShowtimeBlock {
  movieId: number;
  tipo: string;
  horas: string[];
  horasPorDia: string[][];
}

export const SHOWTIME_DAYS: ShowtimeDay[] = [
  { label: 'Hoy', num: '23', mes: 'junio' },
  { label: 'Manana', num: '24', mes: 'junio' },
  { label: 'Jueves', num: '25', mes: 'junio' },
  { label: 'Viernes', num: '26', mes: 'junio' },
  { label: 'Sabado', num: '27', mes: 'junio' },
  { label: 'Domingo', num: '28', mes: 'junio' },
];

export const SHOWTIMES_DATA: ShowtimeBlock[] = [
  {
    movieId: 1,
    tipo: 'DOB',
    horas: ['05:00 PM', '06:50 PM', '09:15 PM'],
    horasPorDia: [
      ['03:20 PM', '05:00 PM', '06:50 PM', '09:15 PM'],
      ['04:10 PM', '06:40 PM', '09:30 PM'],
      ['03:00 PM', '05:35 PM', '08:20 PM'],
      ['04:00 PM', '07:10 PM', '10:00 PM'],
      ['01:30 PM', '04:30 PM', '07:30 PM', '10:20 PM'],
      ['02:00 PM', '05:00 PM', '08:00 PM'],
    ],
  },
  {
    movieId: 2,
    tipo: 'DOB',
    horas: ['04:30 PM', '07:30 PM', '08:25 PM', '09:45 PM'],
    horasPorDia: [
      ['04:30 PM', '07:30 PM', '09:45 PM'],
      ['03:15 PM', '06:15 PM', '08:25 PM'],
      ['04:00 PM', '07:00 PM', '09:40 PM'],
      ['05:00 PM', '08:00 PM', '10:30 PM'],
      ['02:20 PM', '05:20 PM', '08:20 PM', '10:50 PM'],
      ['01:40 PM', '04:40 PM', '07:40 PM'],
    ],
  },
  {
    movieId: 3,
    tipo: 'SUB',
    horas: ['03:40 PM', '06:10 PM', '08:50 PM'],
    horasPorDia: [
      ['03:40 PM', '06:10 PM', '08:50 PM'],
      ['04:20 PM', '07:20 PM'],
      ['03:00 PM', '06:00 PM', '09:00 PM'],
      ['05:10 PM', '08:10 PM', '10:20 PM'],
      ['01:50 PM', '04:50 PM', '07:50 PM'],
      ['02:30 PM', '05:30 PM', '08:30 PM'],
    ],
  },
  {
    movieId: 4,
    tipo: 'DOB',
    horas: ['08:00 PM'],
    horasPorDia: [
      ['06:00 PM', '08:00 PM'],
      ['05:30 PM', '08:30 PM'],
      ['06:20 PM', '09:10 PM'],
      ['07:00 PM', '10:00 PM'],
      ['04:00 PM', '07:00 PM', '10:10 PM'],
      ['05:00 PM', '08:00 PM'],
    ],
  },
  {
    movieId: 5,
    tipo: 'SUB',
    horas: ['04:50 PM', '07:20 PM'],
    horasPorDia: [
      ['04:50 PM', '07:20 PM'],
      ['03:50 PM', '06:30 PM', '09:00 PM'],
      ['05:00 PM', '07:40 PM'],
      ['04:30 PM', '07:10 PM', '09:50 PM'],
      ['02:10 PM', '05:10 PM', '08:10 PM'],
      ['03:20 PM', '06:20 PM'],
    ],
  },
  {
    movieId: 6,
    tipo: 'DOB',
    horas: ['05:40 PM', '08:40 PM'],
    horasPorDia: [
      ['05:40 PM', '08:40 PM'],
      ['04:40 PM', '07:40 PM', '10:00 PM'],
      ['06:00 PM', '09:00 PM'],
      ['05:20 PM', '08:20 PM', '10:40 PM'],
      ['03:10 PM', '06:10 PM', '09:10 PM'],
      ['04:15 PM', '07:15 PM'],
    ],
  },
  {
    movieId: 7,
    tipo: 'DOB',
    horas: ['01:20 PM', '03:50 PM', '06:20 PM'],
    horasPorDia: [
      ['01:20 PM', '03:50 PM', '06:20 PM'],
      ['12:40 PM', '03:10 PM', '05:40 PM'],
      ['01:00 PM', '03:30 PM', '06:00 PM'],
      ['02:00 PM', '04:30 PM', '07:00 PM'],
      ['11:30 AM', '02:00 PM', '04:30 PM', '07:00 PM'],
      ['11:50 AM', '02:20 PM', '04:50 PM'],
    ],
  },
  {
    movieId: 8,
    tipo: 'SUB',
    horas: ['05:10 PM', '08:10 PM', '10:20 PM'],
    horasPorDia: [
      ['05:10 PM', '08:10 PM', '10:20 PM'],
      ['04:50 PM', '07:50 PM'],
      ['05:30 PM', '08:30 PM'],
      ['06:10 PM', '09:10 PM', '11:00 PM'],
      ['03:40 PM', '06:40 PM', '09:40 PM'],
      ['04:30 PM', '07:30 PM', '10:10 PM'],
    ],
  },
];
