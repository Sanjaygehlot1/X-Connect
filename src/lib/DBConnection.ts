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
        console.log(Connect)
        Connection.isConnected = Connect.connections[0].readyState
        console.log("DB Connected Successfully!")
    } catch (error) {
        console.log("DB COnnection Failed")
        process.exit(1)
    }
}

export default DBConnect