import { useEffect, useState } from "react";

type Tenant = { name: string; phone: string };
type Room = {
  id: number;
  number: string;
  floor: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  price: number;
  tenant: Tenant | null;
};

const STATUS_STYLE = {
  AVAILABLE: { bg: "bg-green-100 border-green-300", dot: "bg-green-400", label: "ว่าง" },
  OCCUPIED: { bg: "bg-blue-100 border-blue-300", dot: "bg-blue-400", label: "มีผู้เช่า" },
  MAINTENANCE: { bg: "bg-yellow-100 border-yellow-300", dot: "bg-yellow-400", label: "ซ่อมบำรุง" },
};

function RoomCard({ room }: { room: Room }) {
  const s = STATUS_STYLE[room.status];
  return (
    <div className={`border rounded-xl p-4 cursor-pointer hover:shadow-md transition ${s.bg}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-lg font-semibold text-gray-800">ห้อง {room.number}</span>
        <span className="flex items-center gap-1 text-xs">
          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>
      <p className="text-sm text-gray-500">ชั้น {room.floor}</p>
      <p className="text-sm text-gray-500">{room.price.toLocaleString()} บาท/เดือน</p>
      {room.tenant && (
        <p className="mt-2 text-sm font-medium text-gray-700">👤 {room.tenant.name}</p>
      )}
    </div>
  );
}

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState<"ALL" | Room["status"]>("ALL");

  useEffect(() => {
    fetch("http://localhost:3000/rooms")
      .then((r) => r.json())
      .then(setRooms);
  }, []);

  const floors = [...new Set(rooms.map((r) => r.floor))].sort();
  const filtered = rooms.filter((r) => filter === "ALL" || r.status === filter);

  const summary = {
    AVAILABLE: rooms.filter((r) => r.status === "AVAILABLE").length,
    OCCUPIED: rooms.filter((r) => r.status === "OCCUPIED").length,
    MAINTENANCE: rooms.filter((r) => r.status === "MAINTENANCE").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Room Directory</h1>
        <p className="text-gray-500 mb-6">ภาพรวมห้องพักทั้งหมด</p>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(STATUS_STYLE).map(([key, s]) => (
            <div key={key} className={`border rounded-xl p-4 text-center ${s.bg}`}>
              <p className="text-2xl font-bold text-gray-800">{summary[key as Room["status"]]}</p>
              <p className="text-sm text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["ALL", "AVAILABLE", "OCCUPIED", "MAINTENANCE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                filter === f ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {f === "ALL" ? "ทั้งหมด" : STATUS_STYLE[f].label}
            </button>
          ))}
        </div>

        {/* Rooms by floor */}
        {floors.map((floor) => {
          const floorRooms = filtered.filter((r) => r.floor === floor);
          if (!floorRooms.length) return null;
          return (
            <div key={floor} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 mb-3">ชั้น {floor}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {floorRooms.map((room) => <RoomCard key={room.id} room={room} />)}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-12">ไม่มีห้องในหมวดนี้</p>
        )}
      </div>
    </div>
  );
}