const mongoose = require('mongoose');
const Payment = require('../models/payment');

exports.createPayment = async (req, res) => {
    try {
        const payload = req.body;
        if (!payload.bookingId || !payload.amount) {
            return res.status(400).json({ success: false, message: 'bookingId and amount are required' });
        } 
        const payment = await Payment.create({
            bookingId: payload.bookingId,
            amount: payload.amount,
            paymentMethod: payload.method || 'CASH',
            paymentDate: payload.paidAt || new Date()
        });
        return res.status(201).json({ success: true, data: payment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        // ✅ Deep Populating: Payment -> Booking -> Vehicle
        const payments = await Payment.find()
            .populate({
                path: 'bookingId',
                populate: {
                    path: 'vehicleId'
                }
            })
            .sort({ paymentDate: -1 }); // Sort by newest first
            
        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const id = req.params.id;
        
        const populateOptions = {
            path: 'bookingId',
            populate: {
                path: 'vehicleId'
            }
        };

        // If valid ObjectId, try findById first
        if (mongoose.Types.ObjectId.isValid(id)) {
            const payment = await Payment.findById(id).populate(populateOptions);
            if (payment) return res.status(200).json({ success: true, data: payment });
        }

        // If not found by ObjectId (or id not ObjectId), try transactionId 
        let payment = await Payment.findOne({ transactionId: id }).populate(populateOptions);
        if (payment) return res.status(200).json({ success: true, data: payment });

        // Try bookingId as fallback
        if (mongoose.Types.ObjectId.isValid(id)) {
            payment = await Payment.findOne({ bookingId: id }).populate(populateOptions);
            if (payment) return res.status(200).json({ success: true, data: payment });
        }
        
        return res.status(404).json({ success: false, message: 'Payment not found' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};