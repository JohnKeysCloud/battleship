// * Types
export type PositionStates = {
  vacant: symbol;
  occupied: symbol;
};
export type Coordinates = [number, number];
export type AxisName = `row-${number}` | `column-${number}`;

// * Interfaces
export interface IPosition {
  bow: Coordinates; // [rowIndex, colIndex]
  stern: Coordinates; // [rowIndex, colIndex]
}
interface IGridGameboard<T> {
  readonly board: T[][];
  fillValue: T;
  placePiece(options: IPlacePieceWrapperParams): void;
  removePiece(endpoint: IPosition): void;
  resetBoard(): void;
}
export interface IGridGameboardSquare<T> extends IGridGameboard<T> {
  boardSize: number;
}
export interface IShipConfigurations {
  direction: 'horizontal' | 'vertical';
  gamePieceSize: number;
}
export interface IValidPlacementCallbackParams extends IShipConfigurations {
  gameboard: IGridGameboardSquare<symbol>;
}
export interface IValidPositionsResult {
  [key: AxisName]: IPosition[];
}
export interface IPlacePieceWrapperParams {
  coordinates: Coordinates;
  configurations?: IShipConfigurations;
}
