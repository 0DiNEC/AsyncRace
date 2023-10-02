import {
  createCarData,
  deleteCarData,
  getCarsDataById,
  updateCarData
} from '../data/data';
import { rebuildDataElements } from '../page/page';
import { ICar } from '../types/Car';

async function selectCar(id: string): Promise<void> {
  const data: ICar = await getCarsDataById(id);
  const carNameInput: HTMLInputElement | null =
    document.querySelector('.update-input');
  const carColorInput: HTMLInputElement | null = document.querySelector(
    '.car-color-input_update'
  );

  if (carNameInput && carColorInput) {
    carNameInput.value = data.name;
    carColorInput.value = data.color;
    localStorage.setItem('selected-car_id', id);
  }
}

async function createCar(e: MouseEvent): Promise<void> {
  const target = e.target as HTMLElement;
  if (target.classList.contains('blocked')) return;

  const parent: HTMLElement | null =
    (target.closest('.car-create') as HTMLElement | null) ?? null;
  if (parent) {
    const name = parent.querySelector('.create-input')! as HTMLInputElement;
    const color = (
      parent.querySelector('.car-color-input_create')! as HTMLInputElement
    ).value;
    if (name.value.trim().length === 0) {
      name.placeholder = 'Please write something';
      return;
    }
    await createCarData(name.value, color);

    await rebuildDataElements();
    name.value = '';
  }
}

async function deleteCar(id: string): Promise<void> {
  const getLocalSelectedId = localStorage.getItem('selected-car_id');
  if (
    getLocalSelectedId &&
    getLocalSelectedId !== '' &&
    getLocalSelectedId === id
  ) {
    localStorage.setItem('selected-car_id', '');
    (document.querySelector('.update-input')! as HTMLInputElement).value = '';
  }
  await deleteCarData(id);
  await rebuildDataElements();
}

async function updateCar(e: MouseEvent): Promise<void> {
  const target = e.target as HTMLElement;
  if (target.classList.contains('blocked')) return;

  const parent: HTMLElement | null =
    (target.closest('.car-update') as HTMLElement | null) ?? null;
  if (parent) {
    const id = localStorage.getItem('selected-car_id');
    if (id) {
      const name = parent.querySelector('.update-input')! as HTMLInputElement;
      if (name.value.trim().length === 0) {
        name.setAttribute('placeholder', 'You need to write car name');
        return;
      }
      const color = (
        parent.querySelector('.car-color-input_update')! as HTMLInputElement
      ).value;
      await updateCarData(name.value.trim(), color, id);
      await rebuildDataElements();
    }
  }
}

export { selectCar, createCar, deleteCar, updateCar };
