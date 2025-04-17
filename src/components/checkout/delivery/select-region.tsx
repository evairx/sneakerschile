import { selectedRegion } from "@/stores/checkout";
import Selector from "@/components/selector"

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

export default function SelectRegion({ regions }: { regions: Region[] }) {
  
  const handleClick = (item: Region) => {
    selectedRegion.set(item);
  }

  return (
    <Selector instanceId="selector-1" placeholder="Seleccionar Región" items={regions} onChange={handleClick} />
  );
}
