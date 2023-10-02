import { getPageNum, rebuildDataElements, setPageNum } from '../page';
import {
  getWinnerPage,
  rebuildWinnerData,
  setWinnerPage
} from '../winners/Dialog/winnersDialog';
import './pagination.scss';

type searchElement = 'track-list-title' | 'winner-title';

export default function buildPaginationButton(
  search: searchElement,
  isRow: boolean = false
) {
  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  if (isRow) pagination.classList.add('row');

  const previousPage = document.createElement('button');
  previousPage.classList.add('previous-page', 'pagination-button');
  previousPage.textContent = 'Prev';

  const nextPage = document.createElement('button');
  nextPage.classList.add('next-page', 'pagination-button');
  nextPage.textContent = 'Next';

  previousPage.addEventListener('click', () => {
    const allElements = document.querySelector(`.${search}`);
    if (allElements) {
      const str = allElements.textContent!;
      if (search === 'track-list-title') {
        const count = Math.ceil(
          parseInt(str.slice(str.indexOf('#') + 1), 10) / 7
        );
        const currentPage = getPageNum();
        if (currentPage - 1 <= 0) {
          setPageNum(count);
        } else {
          setPageNum(currentPage - 1);
        }
        rebuildDataElements();
      } else {
        const count = Math.ceil(
          parseInt(str.slice(str.indexOf('#') + 1), 10) / 10
        );
        const currentPage = getWinnerPage();
        if (currentPage - 1 <= 0) {
          setWinnerPage(count);
        } else {
          setWinnerPage(currentPage - 1);
        }
        rebuildWinnerData();
      }
    }
  });

  nextPage.addEventListener('click', () => {
    const allElements = document.querySelector(`.${search}`);
    if (allElements) {
      const str = allElements.textContent!;
      if (search === 'track-list-title') {
        const count = Math.ceil(
          parseInt(str.slice(str.indexOf('#') + 1), 10) / 7
        );
        const currentPage = getPageNum();
        if (currentPage + 1 > count) {
          setPageNum(1);
        } else {
          setPageNum(currentPage + 1);
        }
        rebuildDataElements();
      } else {
        const count = Math.ceil(
          parseInt(str.slice(str.indexOf('#') + 1), 10) / 10
        );
        const currentPage = getWinnerPage();
        if (currentPage + 1 > count) {
          setWinnerPage(1);
        } else {
          setWinnerPage(currentPage + 1);
        }
        rebuildWinnerData();
      }
    }
  });

  pagination.appendChild(previousPage);
  pagination.appendChild(nextPage);
  return pagination;
}
