import carName from './randomCarName.json';
import carModel from './randomCarModel.json';
import { ICar } from '../types/Car';

function getRandomCarName() {
  const randomBrand = Math.floor(Math.random() * carName.length);
  const randomModal = Math.floor(Math.random() * carModel.length);
  return `${carName[randomBrand]} ${carModel[randomModal]}`;
}

function getRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');
  const hexColor = `#${rHex}${gHex}${bHex}`;

  return hexColor;
}

export default function generateCars(): Pick<ICar, 'name' | 'color'>[] {
  const cars: Pick<ICar, 'name' | 'color'>[] = [];
  for (let i = 0; i < 100; i++) {
    const name = getRandomCarName();
    const color = getRandomColor();
    cars.push({
      name,
      color
    });
  }
  return cars;
}
