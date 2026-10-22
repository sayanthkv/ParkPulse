const cron = require('node-cron');
const Booking = require('../models/Booking');

const initCronScheduler = () => {
  // Runs every minute: '0 * * * * *'
  cron.schedule('0 * * * * *', async () => {
    try {
      const now = new Date();
      // Target window: Bookings expiring between 4 and 6 minutes from now
      const fiveMinsLater = new Date(now.getTime() + 5 * 60 * 1000);
      const sixMinsLater = new Date(now.getTime() + 6 * 60 * 1000);

      const expiringBookings = await Booking.find({
        status: { $in: ['BOOKED', 'ACTIVE'] },
        reminderSent: false,
        endTime: { $gte: fiveMinsLater, $lte: sixMinsLater }
      }).populate('slotId');

      for (const booking of expiringBookings) {
        console.log(
          `⏰ [AUTOMATED ALERT] Booking for vehicle ${booking.vehicleNumber} at Slot ${booking.slotId.slotNumber} expires in 5 minutes! (End Time: ${booking.endTime.toLocaleTimeString()})`
        );

        // Mark as sent to prevent duplicate notifications
        booking.reminderSent = true;
        await booking.save();
      }
    } catch (error) {
      console.error('Error running 5-minute reminder cron job:', error.message);
    }
  });

  console.log('⏱️ Node-Cron Scheduler initialized for 5-minute booking expiry alerts.');
};

module.exports = initCronScheduler;