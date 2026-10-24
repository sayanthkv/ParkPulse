import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PARKING_LOCATIONS } from "../constants/parkingLocations";

export default function ParkingSelection({ user, onProceedToConfirm }) {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  // Pre-select location if passed from /locations page, or default to first location
  const [selectedLocation, setSelectedLocation] = useState(
    locationState?.location || PARKING_LOCATIONS[0]
  );
  const [selectedFloor, setSelectedFloor] = useState(
    selectedLocation?.hasMultipleFloors ? null : 1
  );
  const [selectedBay, setSelectedBay] = useState(null);

  // Mock array for demonstration - connect to backend occupied bays API if needed
  const occupiedBays = [3, 7, 12, 18];

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setSelectedFloor(loc.hasMultipleFloors ? null : 1);
    setSelectedBay(null);
  };

  const handleFloorSelect = (floorNum) => {
    setSelectedFloor(floorNum);
    setSelectedBay(null);
  };

  const handleProceed = () => {
    if (!selectedLocation || !selectedFloor || !selectedBay) return;

    const bookingPayload = {
      locationId: selectedLocation.id,
      locationName: selectedLocation.name,
      floorNumber: selectedFloor,
      bayNumber: selectedBay,
      totalAmount: 100, // Customize amount calculation as needed
    };

    if (onProceedToConfirm) {
      onProceedToConfirm(bookingPayload);
    }

    // Navigate to confirmation page passing booking details in route state
    navigate("/confirm", { state: { bookingData: bookingPayload } });
  };

  return (
    <div className="relative min-h-screen text-white bg-zinc-950 flex flex-col justify-between pt-24 pb-12 px-6">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 blur-sm"
        style={{ backgroundImage: `url('/kannur-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div>
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase font-bold">
              KANNUR PARKING NETWORK
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Select Parking <span className="text-red-500">Slot</span>
            </h1>
          </div>
          <button
            onClick={() => navigate("/locations")}
            className="text-xs font-mono text-zinc-400 hover:text-white border border-white/20 px-4 py-2 rounded-xl transition"
          >
            ← Back to Locations
          </button>
        </div>

        {/* 1. Location Selection Cards */}
        <div>
          <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-3">
            1. Select Parking Facility
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PARKING_LOCATIONS.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleLocationSelect(loc)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                    isSelected
                      ? "bg-red-600/20 border-red-500 shadow-lg shadow-red-500/20"
                      : "bg-black/50 border-white/10 hover:border-white/30"
                  }`}
                >
                  <h3 className="font-bold text-white text-sm mb-1">{loc.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {loc.hasMultipleFloors
                      ? `${loc.totalFloors} Floors • ${loc.baysPerFloor} Bays/Floor`
                      : `1 Floor • ${loc.baysPerFloor} Total Bays`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Floor Selection (Only for Multi-Floor Facilities) */}
        {selectedLocation && selectedLocation.hasMultipleFloors && (
          <div>
            <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-3">
              2. Select Floor
            </h2>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: selectedLocation.totalFloors }, (_, i) => i + 1).map((floor) => {
                const isSelected = selectedFloor === floor;
                return (
                  <button
                    key={floor}
                    onClick={() => handleFloorSelect(floor)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                      isSelected
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
                        : "bg-white/5 border border-white/10 text-zinc-300 hover:border-white/30"
                    }`}
                  >
                    Floor {floor}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Bays Grid */}
        {selectedLocation && selectedFloor && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                3. Select Bay {selectedLocation.hasMultipleFloors && `(Floor ${selectedFloor})`}
              </h2>
              <div className="flex gap-4 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-zinc-800 border border-white/20 inline-block" /> Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-600 inline-block" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-zinc-700/50 opacity-40 inline-block" /> Occupied
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2.5">
              {Array.from({ length: selectedLocation.baysPerFloor }, (_, i) => i + 1).map((bay) => {
                const isOccupied = occupiedBays.includes(bay);
                const isSelected = selectedBay === bay;

                return (
                  <button
                    key={bay}
                    disabled={isOccupied}
                    onClick={() => setSelectedBay(bay)}
                    className={`py-3 rounded-xl font-mono font-bold text-xs transition border ${
                      isSelected
                        ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/50 scale-105"
                        : isOccupied
                        ? "bg-zinc-900 border-white/5 text-zinc-600 cursor-not-allowed opacity-40"
                        : "bg-black/60 border-white/10 text-zinc-300 hover:border-white/40"
                    }`}
                  >
                    B-{bay}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Slot Selection Confirmation Bar */}
        {selectedLocation && selectedFloor && selectedBay && (
          <div className="bg-black/80 border border-red-500/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
            <div>
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-bold">
                SLOT SELECTED
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedLocation.name}
              </h3>
              <p className="text-xs text-zinc-300 font-mono mt-0.5">
                Floor: <strong className="text-white">Floor {selectedFloor}</strong> | Bay:{" "}
                <strong className="text-red-400">Bay B-{selectedBay}</strong>
              </p>
            </div>
            <button
              onClick={handleProceed}
              className="bg-red-600 hover:bg-red-500 text-white font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/40 cursor-pointer w-full sm:w-auto"
            >
              Book Selected Slot →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}