interface IEngine {
  velocity: number;
  distance: number;
}

type EngineStatus = 'started' | 'stopped';

export { IEngine, EngineStatus };
