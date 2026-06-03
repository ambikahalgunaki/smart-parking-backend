const Vehicle = require('../models/vehicle')
const Slot = require('../models/Slot')
const Booking = require('../models/booking')
const Payment = require('../models/payment')

//Vehicle Booking entry
exports.VehicleEntry = async (req, res) => {
    try {
        const { vehicleId } = req.body
        const vehicle = await Vehicle.findById(vehicleId)
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found !!'
            })
        }
        //checking whether the same vehicle already parked or not
        const activeBooking = await Booking.findOne({
            vehicleId,
            status: "ACTIVE"
        })
        if (activeBooking) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle already parked !!'
            })
        }
        //Finding available slot for the vehicle type
        const slot = await Slot.findOne({
            slotType: vehicle.vehicleType,
            status: "AVAILABLE"
        })
        if (!slot) {
            return res.status(400).json({
                success: false,
                message: 'No slot available'
            })
        }
        slot.status = "OCCUPIED"
        await slot.save()

        const booking = await Booking.create({
            vehicleId,
            slotId: slot._id
        })
        return res.status(201).json({
            success: true,
            message: 'Vehicle parked successfully !!',
            data: booking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Vehicle exit
exports.VehicleExit = async (req, res) => {
    try {
        const bookingId = req.params.id              // ← FIX 1: was req.params.bookingId
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found !!'
            })
        }
        if (booking.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                message: 'Vehicle already exited'
            })
        }

        const exitTime = new Date();
        const totalMiliseconds = exitTime - booking.entryTime
        const totalHours = Math.ceil(totalMiliseconds / (1000 * 60 * 60))   // ← FIX 2: was (1000 * 6 * 60)
        let amount = 50
        if (totalHours > 2) {
            amount += (totalHours - 2) * 20
        }

        booking.exitTime = exitTime
        booking.totalHours = totalHours
        booking.status = "COMPLETED"
        await booking.save()

        const slot = await Slot.findById(booking.slotId)     // ← FIX 3: was booking.slotId._id
        if (slot) {
            slot.status = "AVAILABLE"
            await slot.save()
        }

                // Make sure this path matches your exact filename (lowercase p)
        const Payment = require('../models/payment');

                const payment = await Payment.create({
            bookingId: booking._id,
            amount,
            paymentMethod: "UPI",
            paymentDate: new Date() // <-- ADD THIS LINE TO FORCE THE DATE
        })

        console.log("✅ Payment Created Successfully:", payment._id, "Amount:", amount);

        return res.status(200).json({
            success: true,
            message: 'Vehicle exited successfully !!',
            totalHours,
            amount,
            payment
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('vehicleId', 'vehicleNumber vehicleType ownerName')
            .populate('slotId', 'slotNumber floor')
            .sort({ createdAt: -1 });
            
        return res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};