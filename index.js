const express=require('express');
const app=express()
const port=process.env.PORT ||3000
require('dotenv').config()
const mongoose=require('mongoose')
// import from model/Quote
const Quotes=require('./models/Quote')



app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.listen(port,()=>console.log('listening on port 3000'))


app.get('/',async(req,res)=>{
    const data=await readFromDb()
    console.log("data",data)
    console.log('you are home')
   
    res.send(JSON.stringify(data))
})

app.get('/quotes',(req,res)=>{

console.log('you on /quotes')
res.sendFile(__dirname+ '/public/index.html')
})


app.post('/quotes',async(req,res)=>{
    const reqBody=req.body
    console.log(reqBody)
    writeToDb(reqBody.quoteId,reqBody.title,reqBody.author,reqBody.quote)
})

// moongose / Mongodb
mongoose.connect(process.env.dburi)
const db=mongoose.connection
db.on("error", (error) => console.error(error));
db.once("open", () => console.error("Connected to db"));



const readFromDb=async()=>{
   return await Quotes.find().lean()
}

const writeToDb=async(quoteId,title,author,quote)=>{
    const query = {quoteId:quoteId}
    const update={
    $set:{
        quoteId:quoteId,
        title:title,
        author:author,
        quote:quote
    }
    }
   return await Quotes.findOneAndUpdate(query,update,{upsert:true})
}



