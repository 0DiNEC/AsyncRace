import { ICar } from './Car';

interface IResult {
  id: number;
  time: number;
  bFinished: boolean;
}

interface IWinner {
  car: ICar;
  result: IResult;
}

interface IWinnerCar {
  id: string;
  wins: number;
  time: number;
}

type TWinnersCar = {
  items: IWinnerCar[];
  total: string | null;
};

export { IWinner, IResult, IWinnerCar, TWinnersCar };
