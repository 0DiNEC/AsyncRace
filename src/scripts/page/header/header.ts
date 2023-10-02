import { createCarData } from '../../data/data';
import { createCar, selectCar, updateCar } from '../../events/query';
import { startRace, resetRace } from '../../events/race';
import generateCars from '../../randomizeData/randomizeGenerator';
import { ICar, TCars } from '../../types/Car';
import { rebuildDataElements } from '../page';
import { rebuildWinnerData } from '../winners/Dialog/winnersDialog';
import './header.scss';

function buildDataList(carsItems: ICar[]) {
  const datalist = document.createElement('datalist');
  datalist.setAttribute('id', 'car-list');

  for (const car of carsItems) {
    const option = document.createElement('option');
    option.setAttribute('id', `option-${car.id}`);
    option.setAttribute('value', `${car.name.length !== 0 ? car.name : ' '}`);
    datalist.appendChild(option);
  }
  return datalist;
}

async function buildHeader(data: TCars): Promise<void> {
  const header = document.createElement('header');
  header.classList.add('header');

  const makeLinksElement = (): HTMLElement => {
    const links = document.createElement('div');
    links.classList.add('links');

    const garageBtn = document.createElement('button');
    garageBtn.classList.add('garage-btn', 'links-btn');
    garageBtn.type = 'button';
    garageBtn.textContent = 'to garage'.toUpperCase();

    const winnersBtn = document.createElement('button');
    winnersBtn.classList.add('winners-btn', 'links-btn');
    winnersBtn.type = 'button';
    winnersBtn.textContent = 'to winners'.toUpperCase();

    winnersBtn.addEventListener('click', () => {
      const winnerDialog = document.querySelector('.winner-dialog');
      if (winnerDialog && !winnerDialog.classList.contains('active')) {
        winnerDialog.classList.add('active');
        document.body.classList.add('stop-scroll');
        rebuildWinnerData();
      }
    });

    garageBtn.addEventListener('click', () => {
      const winnerDialog = document.querySelector('.winner-dialog');
      if (winnerDialog && winnerDialog.classList.contains('active')) {
        winnerDialog.classList.remove('active');
        document.body.classList.remove('stop-scroll');
      }
    });

    links.appendChild(garageBtn);
    links.appendChild(winnersBtn);

    return links;
  };

  const makeCarChangerElement = async (): Promise<HTMLElement> => {
    const carMaker = document.createElement('div');
    carMaker.classList.add('car-maker');

    const makerElement = async (
      modeClassName: string,
      onClick: (e: MouseEvent) => void,
      isDataList: boolean = false
    ) => {
      const maker = document.createElement('div');
      maker.classList.add(`car-${modeClassName}`, 'car-setting');

      const makerNameInput = document.createElement('input');
      makerNameInput.classList.add('car-maker-input', `${modeClassName}-input`);
      if (isDataList) {
        const carsItems: ICar[] = data.items;
        makerNameInput.appendChild(buildDataList(carsItems));
        makerNameInput.setAttribute('list', 'car-list');
        makerNameInput.addEventListener('input', async (e: Event) => {
          const targetInput = e.target as HTMLInputElement;
          const userValue = targetInput.value.trim();

          const dataList = targetInput.firstElementChild as HTMLDataListElement;
          const options = Array.from(dataList.options);

          const selectedOption = options.find(
            (option) => option.value.trim() === userValue.trim()
          );
          if (typeof selectedOption !== 'undefined') {
            const id =
              userValue.trim().length === 0
                ? ''
                : selectedOption.id.split('-')[1];
            await selectCar(id);
          }
        });
      }

      const makerColorInput = document.createElement('input');
      makerColorInput.type = 'color';
      makerColorInput.classList.add(
        'car-color-input',
        `car-color-input_${modeClassName}`
      );

      const makerCarBtn = document.createElement('button');
      makerCarBtn.classList.add('car-btn', `car-${modeClassName}-btn`);
      makerCarBtn.textContent = `${modeClassName}`.toUpperCase();
      makerCarBtn.addEventListener('click', onClick);

      maker.appendChild(makerNameInput);
      maker.appendChild(makerColorInput);
      maker.appendChild(makerCarBtn);

      return maker;
    };

    const createEditor = await makerElement('create', (e: MouseEvent) =>
      createCar(e)
    );
    const updateEditor = await makerElement(
      'update',
      (e: MouseEvent) => updateCar(e),
      true
    );
    carMaker.appendChild(createEditor);
    carMaker.appendChild(updateEditor);

    return carMaker;
  };

  const makeFuncButtons = (): HTMLElement => {
    const buttons = document.createElement('div');
    buttons.classList.add('func-btns');

    const raceBtn = document.createElement('button');
    raceBtn.classList.add('func-btn', 'race-btn', 'func-btn');
    raceBtn.type = 'submit';
    raceBtn.textContent = 'race'.toUpperCase();

    const resetBtn = document.createElement('button');
    resetBtn.classList.add('func-btn', 'reset-btn', 'blocked');
    resetBtn.type = 'reset';
    resetBtn.textContent = 'reset'.toUpperCase();

    const generateBtn = document.createElement('button');
    generateBtn.classList.add('generate-btn');
    generateBtn.type = 'submit';
    generateBtn.textContent = 'generate cars'.toUpperCase();

    raceBtn.addEventListener('click', () => {
      if (!raceBtn.classList.contains('blocked')) {
        startRace();
      }
    });

    resetBtn.addEventListener('click', () => {
      if (!resetBtn.classList.contains('blocked')) {
        resetRace();
      }
    });

    generateBtn.addEventListener('click', () => {
      if (raceBtn.classList.contains('blocked')) return;
      const randomCars = generateCars();
      for (const car of randomCars) {
        createCarData(car.name, car.color);
      }
      rebuildDataElements();
    });

    buttons.appendChild(resetBtn);
    buttons.appendChild(raceBtn);
    buttons.appendChild(generateBtn);

    return buttons;
  };

  header.appendChild(makeLinksElement());
  header.appendChild(await makeCarChangerElement());
  header.appendChild(makeFuncButtons());

  document.body.appendChild(header);
}

export { buildDataList, buildHeader };
