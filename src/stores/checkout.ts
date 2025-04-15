import { atom } from 'nanostores';

interface Shipment {
  name: string;
  price: number;
  content: string;
  payOnDelivery: boolean;
  adaptive: boolean;
}

interface Region {
  id: string;
  region: string;
  shipments: Shipment[];
}

export const selectedRegion = atom<Region>({} as Region);

export const selectedShipping = atom<Shipment>({} as Shipment);

export const priceShipping = atom<number>(0);

export const priceLoading = atom<boolean>(false);

export const selectedPayment = atom<string>("");