import { getCarsData } from '../data/data';
import { engines, resetRace } from '../events/race';
import { TCars } from '../types/Car';
import { buildDataList, buildHeader } from './header/header';
import buildMain from './main/main';
import { buildWinnerDialog } from './winners/Dialog/winnersDialog';
import { buildWinnersModal } from './winners/modalDialog/winnersModalDialog';

const setPageNum = (page: number) => {
  localStorage.setItem('page', `${page}`);
};

const getPageNum = () => {
  const page = localStorage.getItem('page');
  if (page) return parseInt(page, 10);
  return 1;
};

async function buildPage() {
  const page = getPageNum();
  const data: TCars = await getCarsData(page);
  await buildHeader(data);
  buildMain(data);
  buildWinnersModal();
  buildWinnerDialog();
}

async function rebuildDataElements(): Promise<void> {
  const page = getPageNum();
  const data: TCars = await getCarsData(page);
  const mainElement = document.querySelector('main')!;
  const dataList = document.getElementById('car-list')!;
  mainElement.remove();
  dataList.remove();
  await buildMain(data);
  document
    .querySelector('.update-input')!
    .appendChild(buildDataList(data.items));
  if (engines.length > 0) await resetRace();
}

export { buildPage, rebuildDataElements, getPageNum, setPageNum };
