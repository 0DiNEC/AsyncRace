interface ICar {
  id: string;
  color: string;
  name: string;
}

type TCars = {
  items: ICar[];
  total: string | null;
};

export { ICar, TCars };
