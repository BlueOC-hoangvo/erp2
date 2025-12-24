import Warehouse from "./Warehouse";
import Location from "./Location";


export default function WarehouseLocation() {
    return (
        <div className="flex flex-col gap-y-[1.5rem]">
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col gap-y-[1.5rem] mb-6">
                    <Warehouse />
                </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col gap-y-[1.5rem] mb-6">
                    <Location />
                </div>
            </div>
        </div>
    )
}