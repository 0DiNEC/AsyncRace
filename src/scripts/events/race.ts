import { getCarsData, getCarsDataById, startStopEngine } from '../data/data';
import { startDrive, resetDrive, resetCurrentWinner } from '../data/drive';
import { getPageNum } from '../page/page';
import { IEngine } from '../types/IEngine';
import IRace from '../types/IRace';
import { IResult } from '../types/IWinner';

type racerCount = 'all' | 'one';
type toggleMode = 'activate' | 'reset' | 'none';

function toggleButtons(racers: racerCount, mode: toggleMode) {
  const toggleTrackButtons = () => {
    if (racers === 'all') {
      const trackList = document.querySelectorAll('.track');
      if (trackList.length > 0) {
        trackList.forEach((track) => {
          const startEngineButton = track.querySelector('.start-engine-btn')!;
          const breakEngineButton = track.querySelector('.break-engine-btn')!;
          const removeCarButton = track.querySelector('.remove-btn')!;
          if (mode === 'activate') {
            startEngineButton.classList.remove('active');
            breakEngineButton.classList.add('active');
            removeCarButton.classList.add('blocked');
          } else if (mode === 'reset') {
            startEngineButton.classList.add('active');
            breakEngineButton.classList.remove('active');
            removeCarButton.classList.remove('blocked');
          }
        });
      }
    }
  };
  const toggleHeaderButtons = () => {
    const queryButtons = document.querySelectorAll('.car-btn');
    const raceBtn = document.querySelector('.race-btn');
    const resetBtn = document.querySelector('.reset-btn');
    if (racers === 'all') {
      if (queryButtons.length > 0) {
        queryButtons.forEach((button) => button.classList.toggle('blocked'));
      }
      if (raceBtn && resetBtn) {
        raceBtn.classList.toggle('blocked');
        resetBtn.classList.toggle('blocked');
      }
    } else if (raceBtn && resetBtn) {
      if (resetBtn.classList.contains('blocked')) {
        if (queryButtons.length > 0) {
          queryButtons.forEach((button) => button.classList.toggle('blocked'));
        }
        resetBtn.classList.toggle('blocked');
        raceBtn.classList.toggle('blocked');
      }
    }
  };
  toggleTrackButtons();
  toggleHeaderButtons();
}

const changeTrafficLightColor = (track: HTMLElement | null, color: string) => {
  if (track) {
    const trafficLight: HTMLElement = track.querySelector('.start-img')!;
    trafficLight.style.setProperty('--traffic-color', color);
  }
};

const results: { carID: string; res: IResult }[] = [];
const raceItems: IRace[] = [];
const engines: Promise<IEngine>[] = [];
const clearArrays = () => {
  engines.length = 0;
  raceItems.length = 0;
  results.length = 0;
};

async function startRace(): Promise<void> {
  const page = getPageNum();
  const cars = await getCarsData(page);
  toggleButtons('all', 'activate');
  clearArrays();
  for await (const car of cars.items) {
    const engine = startStopEngine(car.id, 'started');
    engines.push(engine);
    const track = document.getElementById(car.id);
    changeTrafficLightColor(track, 'yellow');
  }
  await Promise.all(engines).then((resEnginesItems) => {
    for (let i = 0; i < resEnginesItems.length; i++) {
      const car = cars.items[i];
      const engine = resEnginesItems[i];
      raceItems.push({ car, engine });
    }
    resetCurrentWinner();
    raceItems.forEach((item) => {
      const track = document.getElementById(item.car.id);
      changeTrafficLightColor(track, 'lightgreen');
      startDrive(item, track);
    });
  });
}

async function startCarRace(id: string) {
  await Promise.all(engines);
  const car = await getCarsDataById(id);
  const track = document.getElementById(id);
  toggleButtons('one', 'none');
  changeTrafficLightColor(track, 'yellow');
  const engine = startStopEngine(id, 'started');
  engines.push(engine);
  engine.then((eng) => {
    raceItems.push({ car, engine: eng });
    changeTrafficLightColor(track, 'lightgreen');
    startDrive({ car, engine: eng }, track, false);
  });
}

async function breakCarRace(id: string) {
  await Promise.all(engines);
  const track: HTMLElement | null = document.getElementById(id);
  if (track) {
    const currentRaceItem = raceItems.find((item) => item.car.id === id);
    if (currentRaceItem) {
      startStopEngine(id, 'stopped').then(() => {
        changeTrafficLightColor(track, 'red');
        resetDrive(currentRaceItem, track);
      });
      const enginesButtons = document.querySelectorAll('.start-engine-btn');
      if (enginesButtons.length > 0) {
        let bActiveRace: boolean = true;
        for (const button of enginesButtons) {
          if (!button.classList.contains('active')) {
            bActiveRace = false;
            return;
          }
        }
        if (bActiveRace) {
          const raceBtn = document.querySelector('.race-btn');
          const resetBtn = document.querySelector('.reset-btn');
          toggleButtons('all', 'none');
          if (raceBtn && resetBtn) {
            const queryButtons = document.querySelectorAll('.car-btn');
            if (queryButtons.length > 0) {
              queryButtons.forEach((button) => {
                if (button.classList.contains('blocked'))
                  button.classList.remove('blocked');
              });
            }
            raceBtn.classList.remove('blocked');
            resetBtn.classList.add('blocked');
            const winnerList = document.querySelector('.winner-list');
            if (winnerList) winnerList.innerHTML = '';
          }
        }
      }
    }
  }
}

async function resetRace(): Promise<void> {
  await Promise.all(engines).then(() => {
    const winnerList = document.querySelector('.winner-list');
    if (winnerList) winnerList.innerHTML = '';
    toggleButtons('all', 'reset');
    raceItems.forEach((item) => {
      const track = document.getElementById(item.car.id)!;
      if (track) {
        changeTrafficLightColor(track, 'red');
        resetDrive(item, track);
        startStopEngine(item.car.id, 'stopped');
      }
    });
    clearArrays();
  });
}

export { startRace, resetRace, startCarRace, breakCarRace, results, engines };
