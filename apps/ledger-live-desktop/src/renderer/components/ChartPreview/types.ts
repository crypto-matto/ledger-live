import { BigNumber } from "bignumber.js";
export type Item = {
  date: Date;
  value: BigNumber;
} & object;
type EnrichedItem = {
  date: string;
  value: BigNumber;
  parsedDate: Date;
  ref: Item;
};
export type Data = Item[];
export type EnrichedData = EnrichedItem[];
export type CTX = {
  NODES: object;
  MARGINS: object;
  COLORS: object;
  INVALIDATED: object;
  HEIGHT: number;
  WIDTH: number;
  DATA: EnrichedData;
  x: Function;
  y: Function;
};
