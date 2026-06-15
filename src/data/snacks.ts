export type SnackCategory = 'snacks' | 'canchita' | 'bebidas' | 'combos';

export interface SnackItem {
  id: string;
  name: string;
  price: number;
  categoria: SnackCategory;
  imgUrl: string;
  description: string;
}

export const SNACKS_DATA: SnackItem[] = [
  {
    id: 'pc-chico',
    name: 'Canchita salada chica',
    price: 12.0,
    categoria: 'canchita',
    imgUrl: '/snacks/PC_pequeño.png',
    description: 'Porcion personal para acompanar tu pelicula.',
  },
  {
    id: 'pc-mediano',
    name: 'Canchita salada mediana',
    price: 14.0,
    categoria: 'canchita',
    imgUrl: '/snacks/PC_mediano.png',
    description: 'Tamano ideal para una funcion completa.',
  },
  {
    id: 'pc-grande',
    name: 'Canchita salada grande',
    price: 16.0,
    categoria: 'canchita',
    imgUrl: '/snacks/PC_grande.png',
    description: 'Grande, crujiente y clasica de cine.',
  },
  {
    id: 'pc-gigante',
    name: 'Canchita salada gigante',
    price: 21.0,
    categoria: 'canchita',
    imgUrl: '/snacks/PC_gigante.png',
    description: 'Para compartir entre varias personas.',
  },
  {
    id: 'sn-nachos',
    name: 'Nachos con queso',
    price: 15.0,
    categoria: 'snacks',
    imgUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80',
    description: 'Snack salado con salsa de queso para compartir.',
  },
  {
    id: 'sn-chocolate',
    name: 'Chocolate cine',
    price: 7.5,
    categoria: 'snacks',
    imgUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
    description: 'Dulce clasico para acompanar la funcion.',
  },
  {
    id: 'sn-gomitas',
    name: 'Gomitas surtidas',
    price: 8.5,
    categoria: 'snacks',
    imgUrl: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=600&q=80',
    description: 'Bolsa de gomitas variadas para disfrutar en sala.',
  },
  {
    id: 'b-chica',
    name: 'Gaseosa chica',
    price: 9.0,
    categoria: 'bebidas',
    imgUrl: '/snacks/Vaso_pequeño.png',
    description: 'Bebida fria en vaso chico.',
  },
  {
    id: 'b-mediano',
    name: 'Gaseosa mediana',
    price: 11.0,
    categoria: 'bebidas',
    imgUrl: '/snacks/Vaso_mediano.png',
    description: 'Bebida fria en vaso mediano.',
  },
  {
    id: 'b-grande',
    name: 'Gaseosa grande',
    price: 11.0,
    categoria: 'bebidas',
    imgUrl: '/snacks/Vaso_grande.png',
    description: 'Vaso grande para compartir o disfrutar toda la funcion.',
  },
  {
    id: 'c-personal',
    name: 'Combo personal',
    price: 27.5,
    categoria: 'combos',
    imgUrl: '/snacks/Combo1.png',
    description: 'Canchita y bebida para una persona.',
  },
  {
    id: 'c-duo',
    name: 'Combo duo',
    price: 32.5,
    categoria: 'combos',
    imgUrl: '/snacks/Combo2.png',
    description: 'Canchita y bebidas para compartir.',
  },
];
