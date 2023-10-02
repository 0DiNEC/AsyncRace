import { EngineStatus, IEngine } from '../types/IEngine';
import { ICar, TCars } from '../types/Car';
import { endpoint, url } from '../types/domain';
import { IWinnerCar, TWinnersCar } from '../types/IWinner';

async function getCarsData(
  page: number,
  limit: number | null = 7
): Promise<TCars> {
  const response = await fetch(
    `${url}/${endpoint.garage}?_page=${page}&_limit=${limit}`
  );
  if (!response.ok) {
    throw new Error(`Failed to get data status: ${response.status}`);
  }
  return {
    items: await response.json(),
    total: limit ? response.headers.get('X-total-Count') : null
  };
}

async function getCarsDataById(id: string): Promise<ICar> {
  const response = await fetch(`${url}/${endpoint.garage}/${id}`);
  return response.json();
}

async function createCarData(name: string, color: string): Promise<void> {
  await fetch(`${url}/${endpoint.garage}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      color
    })
  });
}

async function deleteCarData(id: string): Promise<void> {
  await fetch(`${url}/${endpoint.garage}/${id}`, {
    method: 'DELETE'
  });
}

async function updateCarData(name: string, color: string, id: string) {
  await fetch(`${url}/${endpoint.garage}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      color
    })
  });
}

async function startStopEngine(
  id: string,
  status: EngineStatus
): Promise<IEngine> {
  const response = await fetch(
    `${url}/${endpoint.engine}?id=${id}&status=${status}`,
    {
      method: 'PATCH'
    }
  );
  return response.json();
}

async function switchDriveMode(id: string, status: 'drive'): Promise<Response> {
  const response = await fetch(
    `${url}/${endpoint.engine}?id=${id}&status=${status}`,
    {
      method: 'PATCH'
    }
  );
  return response;
}

async function getWinners(
  _page: number,
  _sort: 'id' | 'wins' | 'time',
  _order: 'ASC' | 'DESC',
  _limit: number = 10
): Promise<TWinnersCar> {
  const response = await fetch(
    `${url}/${endpoint.winners}?_page=${_page}&_limit=${_limit}&_sort=${_sort}&_order=${_order}`
  );
  return {
    items: await response.json(),
    total: response.headers.get('X-Total-Count')
  };
}

async function getWinner(id: string): Promise<IWinnerCar> {
  const response = await fetch(`${url}/${endpoint.winners}/${id}`);
  return response.json();
}

async function createWinner(
  id: string,
  wins: number,
  time: number
): Promise<void> {
  await fetch(`${url}/${endpoint.winners}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      wins,
      time
    })
  });
}

async function updateWinner(
  id: string,
  wins: number,
  time: number
): Promise<IWinnerCar> {
  const response = await fetch(`${url}/${endpoint.winners}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      wins,
      time
    })
  });
  return response.json();
}

async function deleteWinner(id: string) {
  await fetch(`${url}/${endpoint.winners}/${id}`, {
    method: 'DELETE'
  });
}

export {
  getCarsData,
  startStopEngine,
  switchDriveMode,
  getCarsDataById,
  createCarData,
  deleteCarData,
  updateCarData,
  getWinners,
  getWinner,
  createWinner,
  updateWinner,
  deleteWinner
};
