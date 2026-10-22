const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

// POST /api/gate/entry
exports.handleGateEntry = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    if (!vehicleNumber) {
      return res.status(400).json({ message: 'Vehicle number is required at the entry gate.' });
    }

    const formattedVehicle = vehicleNumber.toUpperCase().trim();

    // Find active booking for this vehicle number
    const booking = await Booking.findOne({
      vehicleNumber: formattedVehicle,
      status: 'BOOKED'
    });

    if (!booking) {
      return res.status(404).json({
        gateStatus: 'DENIED',
        message: 'No valid reservation found for this vehicle number.'
      });
    }

    // Update booking status and record actual entry timestamp
    booking.status = 'ACTIVE';
    booking.actualEntryTime = new Date();
    await booking.save();

    // Update physical slot status to OCCUPIED
    await Slot.findByIdAndUpdate(booking.slotId, { status: 'OCCUPIED' });

    res.status(200).json({
      gateStatus: 'OPEN',
      message: `Welcome! Entry granted for vehicle ${formattedVehicle}. Barrier raised.`,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Gate entry processing failed.', error: error.message });
  }
};

// POST /api/gate/exit
exports.handleGateExit = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    if (!vehicleNumber) {
      return res.status(400).json({ message: 'Vehicle number is required at the exit gate.' });
    }

    const formattedVehicle = vehicleNumber.toUpperCase().trim();

    // Find active parking session
    const booking = await Booking.findOne({
      vehicleNumber: formattedVehicle,
      status: 'ACTIVE'
    });

    if (!booking) {
      return res.status(404).json({
        gateStatus: 'DENIED',
        message: 'No active parking session found for this vehicle number.'
      });
    }

    const actualExitTime = new Date();
    booking.actualExitTime = actualExitTime;

    // Check for overstay / overtime penalty
    // Penalty rate: ₹100 per overstayed hour (or fraction of an hour)
    let penaltyFee = 0;
    if (actualExitTime > booking.endTime) {
      const overstayMs = actualExitTime - booking.endTime;
      const overstayHours = Math.ceil(overstayMs / (1000 * 60 * 60));
      penaltyFee = overstayHours * 100;
    }

    booking.penaltyFee = penaltyFee;
    booking.status = 'COMPLETED';
    await booking.save();

    // Free up physical slot back to AVAILABLE
    await Slot.findByIdAndUpdate(booking.slotId, { status: 'AVAILABLE' });

    const totalAmount = booking.baseFee + penaltyFee;

    res.status(200).json({
      gateStatus: 'OPEN',
      message: penaltyFee > 0 
        ? `Overstay detected! Penalty: ₹${penaltyFee}. Total due: ₹${totalAmount}. Barrier raised.`
        : `Thank you for using ParkPulse! Total paid: ₹${booking.baseFee}. Barrier raised.`,
      summary: {
        vehicleNumber: formattedVehicle,
        baseFee: booking.baseFee,
        penaltyFee,
        totalAmount,
        entryTime: booking.actualEntryTime,
        exitTime: actualExitTime
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Gate exit processing failed.', error: error.message });
  }
};