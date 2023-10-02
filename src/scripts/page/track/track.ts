import { deleteCar, selectCar } from '../../events/query';
import { breakCarRace, startCarRace } from '../../events/race';
import carSvg from './car.svg';
import './track.scss';

function makeTrackHeader(carName: string): HTMLDivElement {
  const trackHeader = document.createElement('div');
  trackHeader.classList.add('track-header');

  const selectButton = document.createElement('button');
  selectButton.classList.add('select-btn');
  selectButton.addEventListener('click', async (e: Event) => {
    const target = e.target as HTMLElement;
    const parent: HTMLElement | null = target.closest('.track') ?? null;
    if (parent) await selectCar(parent.id);
  });
  selectButton.textContent = 'SELECT';

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-btn');
  removeButton.addEventListener('click', async (e: Event) => {
    const target = e.target as HTMLElement;
    const parent: HTMLElement | null = target.closest('.track') ?? null;
    if (parent) {
      if (removeButton.classList.contains('blocked')) return;
      await deleteCar(parent.id);
    }
  });
  removeButton.textContent = 'REMOVE';

  const carNameTitle = document.createElement('h3');
  carNameTitle.classList.add('car-name');
  carNameTitle.textContent = carName;

  trackHeader.appendChild(selectButton);
  trackHeader.appendChild(removeButton);
  trackHeader.appendChild(carNameTitle);
  return trackHeader;
}

const getSvgString = async (
  carColor: string
): Promise<string> => {
  const response = await fetch(carSvg);
  const svgText = await response.text();

  const modifierSvgText = svgText.replace('fill="#000000"', `fill=${carColor}`);

  return modifierSvgText;
};

function createTrack(
  id: string,
  carName: string,
  carColor: string
): HTMLDivElement {
  const track = document.createElement('div');
  track.classList.add('track');
  track.setAttribute('id', `${id}`);

  const trackArea = document.createElement('div');
  trackArea.classList.add('track-area');

  const startTrackPosition = document.createElement('div');
  startTrackPosition.classList.add('start-track-position');

  const startEngineButton = document.createElement('button');
  startEngineButton.type = 'button';
  startEngineButton.classList.add('start-engine-btn', 'active');
  startEngineButton.textContent = 'A';

  const breakEngineButton = document.createElement('button');
  breakEngineButton.type = 'button';
  breakEngineButton.classList.add('break-engine-btn');
  breakEngineButton.textContent = 'B';

  startEngineButton.addEventListener('click', () => {
    if (startEngineButton.classList.contains('active')) {
      breakEngineButton.classList.add('active');
      startEngineButton.classList.remove('active');
      startCarRace(id);
    }
  });

  breakEngineButton.addEventListener('click', () => {
    if (breakEngineButton.classList.contains('active')) {
      startEngineButton.classList.add('active');
      breakEngineButton.classList.remove('active');
      breakCarRace(id);
    }
  });

  startTrackPosition.appendChild(startEngineButton);
  startTrackPosition.appendChild(breakEngineButton);
  startTrackPosition.insertAdjacentHTML(
    'beforeend',
    '<div class="start-img start-position"></div>'
  );

  trackArea.appendChild(startTrackPosition);
  getSvgString(carColor).then((modifier: string) => {
    trackArea.insertAdjacentHTML(
      'beforeend',
      `
    <div class="end-track-position">
      <div class="finish-img finish-position"></div>
    </div>
    ${modifier}
    `
    );
  });

  track.appendChild(makeTrackHeader(carName));
  track.appendChild(trackArea);
  return track;
}

export { createTrack, getSvgString };
