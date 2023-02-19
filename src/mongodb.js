/*                         Initialisation                         */
// Importing mongoose dependency
// const mongoose = require("mongoose")

// // Creating connection to database
// mongoose.connect(process.env.MongoDB_URI)
//     .then(() => console.log("MongoDB Connected"))
//     .catch(err => console.log(err))

// // MongoDB listeners
// mongoose.connection.on("error", err => console.log(err))
// mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"))

// When process is ended, MongoDB connectionis closed
// process.on("SIGINT", async () => {
//     await mongoose.connection.close()
//     process.exit(0)
// })

function readTable() {

}

function addToTable() {
    
}

function editItem() {
    
}

function deleteFromTable() {
    
}

function getItemFromTable() {
    
}

module.exports = {
    readTable,
    addToTable,
    editItem,
    deleteFromTable,
    getItemFromTable
}