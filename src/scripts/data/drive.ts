import { results } from '../events/race';
import {
  showWinnerModalList,
  addWinner
} from '../page/winners/modalDialog/winnersModalDialog';
import IRace from '../types/IRace';
import { IResult, IWinner, IWinnerCar } from '../types/IWinner';
import { createWinner, getWinner, switchDriveMode, updateWinner } from './data';

let currentWinner: IWinner | null = null;
let position: number = 1;
const getPosition = () => position++;
const setCurrentWinner = async (winner: IWinner) => {
  currentWinner = winner;
  const hasWinner: IWinnerCar = await getWinner(winner.car.id);
  const isEmpty =
    Object.keys(hasWinner).length === 0 && hasWinner.constructor === Object;
  if (isEmpty) {
    await createWinner(winner.car.id, 1, winner.result.time);
  } else {
    const wins = hasWinner.wins + 1;
    const time = Math.min(winner.result.time, hasWinner.time);
    await updateWinner(winner.car.id, wins, time);
  }
};

const resetCurrentWinner = () => {
  currentWinner = null;
  position = 1;
};

function getDistance(
  startPositionElem: HTMLElement,
  finishPositionElem: HTMLElement
): number {
  interface ElementRect {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }
  const rect1: ElementRect = startPositionElem.getBoundingClientRect();
  const rect2: ElementRect = finishPositionElem.getBoundingClientRect();
  return Math.abs(rect1.left - rect2.right);
}

async function startDrive(
  raceItem: IRace,
  track: HTMLElement | null,
  isRace: boolean = true
): Promise<void> {
  let result: IResult = {
    id: 0,
    time: 0,
    bFinished: false
  };

  function renderCarRace(
    car: HTMLElement,
    distance: number,
    animationTime: number
  ): IResult {
    let startTime: null | number = null;
    const result: IResult = {
      id: 0,
      time: 0,
      bFinished: false
    };
    function ride(time: number) {
      if (!startTime) startTime = time;
      const currentTime = time - startTime;
      const progress = Math.round(currentTime * (distance / animationTime));
      car.style.setProperty(
        'transform',
        `translate(${Math.min(progress, distance)}px`
      );
      if (progress < distance) {
        result.id = requestAnimationFrame(ride);
      } else {
        result.bFinished = true;
        result.time = currentTime;
        if (result.bFinished && isRace) {
          const winner: IWinner = {
            car: raceItem.car,
            result
          };
          if (!currentWinner && position === 1) {
            const winnerList = document.querySelector('.winner-list')!;
            winnerList.innerHTML = '';
            setCurrentWinner(winner);
            showWinnerModalList();
          }
          addWinner(winner, getPosition());
        }
      }
    }
    result.id = requestAnimationFrame(ride);
    return result;
  }

  if (track) {
    const car: HTMLElement = track.querySelector('.car')! as HTMLElement;
    const finishPositionElement: HTMLElement = track.querySelector(
      '.finish-position'
    )! as HTMLElement;
    const distance: number = getDistance(car, finishPositionElement);
    const time: number = raceItem.engine.distance / raceItem.engine.velocity;
    result = renderCarRace(car, distance, time);
    results.push({
      carID: raceItem.car.id,
      res: result
    });
    await switchDriveMode(raceItem.car.id, 'drive').then((res) => {
      if (!res.ok) cancelAnimationFrame(result.id);
    });
  }
}

function resetDrive(raceItem: IRace, track: HTMLElement) {
  resetCurrentWinner();
  const currentResultIndex = results.findIndex(
    (item) => item.carID === raceItem.car.id
  );
  if (currentResultIndex !== -1) {
    const currentResult = results.splice(currentResultIndex, 1)[0];
    const car: HTMLElement = track.querySelector('.car')! as HTMLElement;
    car.style.setProperty('transform', 'translate(0px)');
    cancelAnimationFrame(currentResult.res.id);
  }
}

export { startDrive, resetDrive, resetCurrentWinner };
