import { createTrack } from '../page/track/track';
import { ICar, TCars } from '../types/Car';

export default async function loadGarage(
  mainElement: HTMLElement,
  data: TCars
): Promise<void> {
  const garageItems: ICar[] = data.items;
  for (const car of garageItems) {
    const track = createTrack(car.id, car.name, car.color);
    mainElement.appendChild(track);
  }
}
