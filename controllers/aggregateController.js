const Booking = require('../models/Booking');
const Payment = require('../models/payment');

exports.activeVehicleAggregation = async(req, res) => {
    try {
        const data = await Booking.aggregate([
            {
                $match: {
                    status: 'ACTIVE'
                }
            },
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicle"
                }
            },
            {
                $lookup: {
                    from: "slots",
                    localField: "slotId",
                    foreignField: "_id",
                    as: "slot"
                }
            },
            {
                $project: {
                    bookingId: "$_id",                    // ✅ ADD THIS
                    vehicleNumber: {                      // ✅ ADD THIS
                        $arrayElemAt: ["$vehicle.vehicleNumber", 0]
                    },
                    vehicleType: {
                        $arrayElemAt: ["$vehicle.vehicleType", 0]
                    },
                    slotNumber: {
                        $arrayElemAt: ["$slot.slotNumber", 0]
                    },
                    entryTime: 1                          // ✅ ADD THIS
                }
            }
        ])

        return res.status(200).json({
            success: true,
            message: data
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.parkingDurationAggregation = async(req,res)=>{
    try{
        const data = await Booking.aggregate([
            {
                $match: {
                    status: 'COMPLETED'
                }
            },
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicle"
                }
            },
            {
                $lookup: {
                    from: "slots",
                    localField: "slotId",
                    foreignField: "_id",
                    as: "slot"
                }
            },
            {
                $unwind: {
                    path: "$vehicle",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$vehicle.vehicleType",
                    averageDuration: { $avg: "$totalHours" },
                    totalBookings: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            success:true,
            message:data
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.dailyRevenueAnalytics = async (req, res) => {
    try {
        const Payment = require('../models/payment');
        
        const data = await Payment.aggregate([
            {
                $addFields: {
                    safeDate: { $ifNull: ["$paymentDate", "$createdAt"] }
                }
            },
            {
                $match: {
                    safeDate: { $ne: null, $exists: true }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$safeDate", 
                            timezone: "Asia/Kolkata", // <-- CHANGED TO ASIA/KOLKATA FOR PERFECT IST
                        }
                    },
                    dailyRevenue: { $sum: "$amount" },
                    totalPayments: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: data
        });
    } catch (error) {
        console.error("❌ REVENUE AGGREGATION FAILED:", error.message);
        return res.status(200).json({
            success: true,
            message: []
        });
    }
}