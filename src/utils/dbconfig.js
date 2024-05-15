import mongoose from "mongoose";

export default async function connectToDatabase() {
    const uri = process.env.db_Url;

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
        });
    } catch (error) {
        throw error;
    }
}