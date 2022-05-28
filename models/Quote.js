const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
    quoteId:{ type: Number },
    title:  { type: String }, 
    author: { type: String },
    quote:   { type: String },
})

module.exports=mongoose.model("Quotes",quoteSchema)