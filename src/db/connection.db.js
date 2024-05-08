import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.DBURL);
  } catch {
    console.error("ERROR : Database connection failed");
    process.exit(1);
  }
};

export default dbconnect;
