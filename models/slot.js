const mongoose = require('mongoose')

const slotSchema = new mongoose.Schema({
    slotNumber:{
        type:String,
        unique:true
    },
    floor:{
        type:String
    },
    slotType:{
        type:String,
        enum:['BIKE','CAR','TRUCK']
    },
    status:{
        type:String,
        enum:['AVAILABLE','OCCUPIED'],
        default:'AVAILABLE'
    }
},{timestamps:true})

slotSchema.index({
    slotType:1,
    status:1
})

module.exports = mongoose.models.slots || mongoose.model('slots', slotSchema)