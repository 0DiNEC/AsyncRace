import { IWinner } from '../../../types/IWinner';
import './winners.scss';

let winnerList: HTMLElement | null = null;

enum winnerPosition {
  First = 1,
  Second = 2,
  Third = 3
}
const winnerColors: { [key in winnerPosition]: string } = {
  [winnerPosition.First]: '#ffd700',
  [winnerPosition.Second]: '#c0c0c0',
  [winnerPosition.Third]: '#cd7f32'
};

const winnerTextSize: { [key in winnerPosition]: string } = {
  [winnerPosition.First]: '2em',
  [winnerPosition.Second]: '1.8em',
  [winnerPosition.Third]: '1.5em'
};

function addWinner(curWinner: IWinner, position: winnerPosition) {
  if (winnerList) {
    const { name } = curWinner.car;
    const time = (curWinner.result.time / 1000).toFixed(2);
    const color = winnerColors[position] || '#ffffff';
    const fontSize = winnerTextSize[position] || '1.2em';

    const winnerElem = document.createElement('div');
    winnerElem.classList.add('winner');

    const winnerInfoElem = document.createElement('p');
    winnerInfoElem.classList.add('winner-info');
    winnerInfoElem.textContent = `#${position} ${name} :: ${time}sec`;
    winnerInfoElem.style.setProperty('color', color);
    winnerInfoElem.style.setProperty('font-size', fontSize);

    winnerElem.appendChild(winnerInfoElem);
    winnerList.appendChild(winnerElem);
  }
}

function buildWinnersModal() {
  if (winnerList) return;
  const modal = document.createElement('div');
  modal.classList.add('winner-modal');

  winnerList = document.createElement('div');
  winnerList.classList.add('winner-list');

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  modal.appendChild(winnerList);
  document.body.appendChild(modal);
}

function showWinnerModalList() {
  const winnerModal = document.querySelector('.winner-modal');
  if (winnerModal) {
    winnerModal.classList.add('active');
  }
}

export { buildWinnersModal, showWinnerModalList, addWinner };
