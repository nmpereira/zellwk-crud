const express=require('express');
const app=express()
const port=process.env.PORT ||3000


app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.listen(port,()=>console.log('listening on port 3000'))


app.get('/',(req,res)=>{

    console.log('you are home')
   
    res.send(JSON.stringify({key:'hello world!'}))
})

app.get('/quotes',(req,res)=>{

console.log('you on /quotes')
res.sendFile(__dirname+ '/public/index.html')
})


app.post('/quotes',(req,res)=>{

    console.log(req.body)
    console.log(req.route)

})
