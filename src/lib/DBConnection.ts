import mongoose from "mongoose";

type ConnectionObj = {
    isConnected?: number
}

const Connection: ConnectionObj = {}

const DBConnect = async (): Promise<void> => {
    if (Connection.isConnected) {
        console.log("Databse Already Connected")
        return
    }
    try {
        const Connect = await mongoose.connect(process.env.MONGODB_URI || "")
        Connection.isConnected = Connect.connections[0].readyState
        console.log("DB Connected Successfully!")
    } catch (error) {
        console.log("DB Connection Failed",error)
        process.exit(1)
    }
}

export default DBConnect