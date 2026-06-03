const Slot = require('../models/Slot')

//Creating a slot
exports.createSlot = async (req, res) => {
    try {
        const { slotNumber, floor, slotType } = req.body
        const existingSlot = await Slot.findOne({ slotNumber: slotNumber })
        if (existingSlot) {
            return res.status(400).json({
                success: false,
                message: 'Slot already exists !!'
            })
        }
        const slot = await Slot.create({ slotNumber, floor, slotType })
        return res.status(201).json({
            success: true,
            message: 'Slot created successfully !!',
            data: slot               // ← return created slot so frontend can use it
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Getting all slots — FIXED .toSorted → .sort
exports.getAllSlots = async (req, res) => {
    try {
        const slots = await Slot.find().sort({ floor: 1 })
        return res.status(200).json({
            success: true,
            data: slots
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get available slots
exports.availableSlots = async (req, res) => {
    try {
        const { slotType } = req.query
        const filter = { status: 'AVAILABLE' }
        if (slotType) filter.slotType = slotType        // ← only add if provided
        const slots = await Slot.find(filter)
        return res.status(200).json({
            success: true,
            data: slots
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Update slots — FIXED destructuring bug
exports.updateSlotStatus = async (req, res) => {
    try {
        const { status } = req.body
        const id = req.params.id                  // ← was: const { id } = req.params.id
        const slot = await Slot.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
        return res.status(200).json({
            success: true,
            message: 'Slot updated !!',
            data: slot                             // ← return updated slot
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}