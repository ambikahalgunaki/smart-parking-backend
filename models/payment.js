const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'booking'
    },
    amount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:['CASH','UPI','CARD'],
        default:'UPI'
    },
    paymentDate:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

paymentSchema.index({
   paymentDate:-1
})

// Prevent Mongoose Overwrite Error
module.exports = mongoose.models.payment || mongoose.model('payment', paymentSchema);