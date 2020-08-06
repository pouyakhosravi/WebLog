const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    visitCount: Number
})

module.exports = mongoose.model("Counter", CounterSchema, "counterInfo");