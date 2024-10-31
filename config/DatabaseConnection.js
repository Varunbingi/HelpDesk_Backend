import mongoose from "mongoose";



const DatabaseConnection= async () => {
try {
    
    const MONGO_URL = process.env.MONGO_URL 

    const { connection } = await mongoose.connect(MONGO_URL);

    if (connection) {
            console.log(`MongoDB connected: ${connection.host}`);
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default DatabaseConnection;
