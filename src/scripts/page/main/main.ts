import loadGarage from '../../data/garage';
import { TCars } from '../../types/Car';
import { getPageNum } from '../page';
import buildPaginationButton from '../pagination/pagination';
import './main.scss';

export default async function buildMain(data: TCars): Promise<void> {
  const mainElement = document.createElement('main');
  mainElement.classList.add('track-list');

  const title = document.createElement('h1');
  title.classList.add('track-list-title');
  title.textContent = `Garage #${data.total}`;

  const currentPage = document.createElement('h3');
  currentPage.classList.add('track-list-cur-page');
  currentPage.textContent = `Page: ${getPageNum()}`;

  mainElement.appendChild(title);
  mainElement.appendChild(currentPage);
  document.body.appendChild(mainElement);

  await loadGarage(mainElement, data);
  mainElement.appendChild(buildPaginationButton('track-list-title'));
}
