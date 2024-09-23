export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const areArraysEqual = <T>(arrayOne: T[], arrayTwo: T[]) =>
  arrayOne.length === arrayTwo.length
  &&
  arrayOne.every((value, index) => value === arrayTwo[index]);
  
