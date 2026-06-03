const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = 'mongodb+srv://Ambika:Ambika2005@cluster0.fqfajzw.mongodb.net/?appName=Cluster0';
    try {

        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;