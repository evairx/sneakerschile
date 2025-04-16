import { signal } from "@preact/signals";
import { selectedRegion } from "@/stores/checkout";
import { DropdownIcon } from "../icons";

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

const selected = signal<Region | null>(null);
const open = signal<boolean>(false);

export default function SelectRegion({ regions }: { regions: Region[] }) {
  return (
    <div className="relative w-full">
      <select
        id="region"
        value={selected.value?.region || ""}
        onClick={() => {
          open.value = !open.value;
        }}
        onBlur={() => {
          open.value = false;
        }}
        onChange={(e) => {
          const region = regions.find(r => r.region === (e.target as HTMLSelectElement).value);
          if (region) {
            selectedRegion.set(region);
            selected.value = region;
          }
        }}
        className="w-full appearance-none px-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:border-black cursor-pointer"
      >
        <option value="" disabled>
          Selecciona una región
        </option>
        {regions.map((region) => (
          <option key={region.id} value={region.region}>
            {region.region}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <DropdownIcon rotate={open.value}/>
      </div>
    </div>
  );
}
