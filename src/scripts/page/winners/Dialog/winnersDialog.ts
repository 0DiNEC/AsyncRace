import { getSvgString } from '../../track/track';
import { deleteWinner, getCarsDataById, getWinners } from '../../../data/data';
import { TWinnersCar } from '../../../types/IWinner';
import buildPaginationButton from '../../pagination/pagination';
import './winner.scss';

type TSortMethod = {
  sort: 'id' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
};

const setSortMethod = (sortMethod: TSortMethod) => {
  const sortMethodString = JSON.stringify(sortMethod);
  localStorage.setItem('sortMethod', sortMethodString);
};

const getSortMethod = (): TSortMethod => {
  const sortMethodString = localStorage.getItem('sortMethod');
  if (sortMethodString) {
    const sortMethod: TSortMethod = JSON.parse(sortMethodString);
    return sortMethod;
  }
  return {
    sort: 'id',
    order: 'ASC'
  };
};

const setWinnerPage = (page: number) => {
  localStorage.setItem('winner-page', `${page}`);
};

const getWinnerPage = () => {
  const currentPage = localStorage.getItem('winner-page');
  if (currentPage) return parseInt(currentPage, 10);
  return 1;
};

async function addValueToWinnerList(
  num: string,
  carColor: string,
  name: string,
  wins: string,
  bestTime: string,
  isButton: boolean = false
): Promise<HTMLElement> {
  const element = document.createElement('div');
  const fieldClassName = isButton ? 'field-header' : 'field';
  element.classList.add(`${isButton ? 'header-row' : 'row'}`);
  element.innerHTML = `
    <div class="${fieldClassName}">${num}</div>
    <div class="${fieldClassName}">${isButton ? carColor : await getSvgString(carColor)}</div>
    <div class="${fieldClassName}">${name}</div>
    <div class="${fieldClassName} ${isButton ? 'wins-order-btn' : ''}">${wins}</div>
    <div class="${fieldClassName} ${isButton ? 'time-order-btn' : ''}">${bestTime}</div>
  `;
  return element;
}

async function buildWinnerDialog() {
  const winnerDialog = document.createElement('div');
  winnerDialog.classList.add('winner-dialog');

  const winnerList = document.createElement('div');
  winnerList.classList.add('winner-list');

  const title = document.createElement('h1');
  title.classList.add('winner-title');

  const titlePageCount = document.createElement('h3');
  titlePageCount.classList.add('title-page-count');

  winnerList.appendChild(title);
  winnerList.appendChild(titlePageCount);

  const list = document.createElement('div');
  list.classList.add('list');
  list.appendChild(await addValueToWinnerList('Number', 'Car', 'Name', 'Wins', 'Best time', true));

  winnerList.appendChild(list);
  winnerDialog.appendChild(winnerList);
  document.body.appendChild(winnerDialog);
  // eslint-disable-next-line no-use-before-define
  addEventsToButton();
}

async function rebuildWinnerData() {
  const list = document.querySelector('.list');
  if (list) {
    const sortMethod: TSortMethod = getSortMethod();
    const title = document.querySelector('.winner-title')!;
    const titlePageCount = document.querySelector('.title-page-count')!;
    const rows = list.querySelectorAll('.row');
    if (rows.length > 0) rows.forEach((row) => row.remove());
    const page = getWinnerPage();
    const winnerList: TWinnersCar = await getWinners(page, sortMethod.sort, sortMethod.order);

    title.textContent = `Winners: #${winnerList.total}`;
    titlePageCount.textContent = `Page ${page}`;
    for await (const [index, item] of winnerList.items.entries()) {
      const car = await getCarsDataById(item.id);
      const isEmpty = Object.keys(car).length === 0 && car.constructor === Object;
      if (isEmpty) {
        await deleteWinner(item.id);
      } else {
        const num = index + 1 + 10 * (page - 1);
        const element = await addValueToWinnerList(
          `${num}`,
          `${car.color}`,
          `${car.name}`,
          `${item.wins}`,
          `${(item.time / 1000).toFixed(2)}`
        );
        list.appendChild(element);
      }
    }
    list.appendChild(buildPaginationButton('winner-title', true));
  }
}

function addEventsToButton() {
  const winsButton = document.querySelector('.wins-order-btn')!;
  const timesButton = document.querySelector('.time-order-btn')!;

  let winsOrder: 'ASC' | 'DESC' = 'ASC';
  winsButton.addEventListener('click', () => {
    setSortMethod({
      sort: 'wins',
      order: winsOrder
    });
    rebuildWinnerData();
    winsOrder = winsOrder === 'ASC' ? 'DESC' : 'ASC';
  });

  let timesOrder: 'ASC' | 'DESC' = 'ASC';
  timesButton.addEventListener('click', () => {
    setSortMethod({
      sort: 'time',
      order: timesOrder
    });
    rebuildWinnerData();
    timesOrder = timesOrder === 'ASC' ? 'DESC' : 'ASC';
  });
}

export {
  buildWinnerDialog,
  rebuildWinnerData,
  addEventsToButton,
  getWinnerPage,
  setWinnerPage,
  setSortMethod,
  getSortMethod
};
