import React from "react";
import { useNavigate } from "react-router-dom";
import { PARKING_LOCATIONS } from "../constants/parkingLocations";

export default function Locations() {
  const navigate = useNavigate();

  const handleBookNow = (location) => {
    // Navigates directly to the floor & bay selector with pre-selected location
    navigate("/parking-selection", { state: { location } });
  };

  return (
    <div className="relative min-h-screen text-white bg-zinc-950 pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white">
            Kannur Parking <span className="text-red-500">Hubs</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Select a parking facility to reserve multi-floor bays
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PARKING_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="bg-black/60 border border-white/20 rounded-2xl p-6 space-y-4 hover:border-red-500/50 transition shadow-xl"
            >
              <h3 className="text-xl font-bold text-white">{loc.name}</h3>
              <p className="text-xs text-zinc-400 font-mono">
                {loc.hasMultipleFloors
                  ? `🏢 Multi-Level (${loc.totalFloors} Floors • ${loc.baysPerFloor} Bays Each)`
                  : `🅿️ Surface Parking (1 Floor • ${loc.baysPerFloor} Bays)`}
              </p>
              <button
                onClick={() => handleBookNow(loc)}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30"
              >
                Book Now →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}