const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const mongoose = require('mongoose');
// import from model/Quote
const Quotes = require('./models/Quote');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('json spaces', 2);
app.set('view engine', 'ejs');
app.listen(port, () => console.log('listening on port 3000'));

// home page
app.get('/', async (req, res) => {

    let data='def'
	try {
		res.status(200).render(__dirname + '/public/index.ejs',{data:data});
	} catch (err) {
		console.log(err);
	}
});
// gets all quotes
app.get('/quotes', async (req, res) => {
	try {
		const data = await readFromDb();
        
		// res.status(200).send(sorter(data,'quoteId','asc'));
        res.status(200).render(__dirname + '/public/index.ejs',{data:data});

	} catch (err) {
		console.log(err);
	}
});
// get single quote
app.get('/quotes/:id', async (req, res) => {
    let valueId=req.params.id
    let key='quoteId'
	try {
		const data = await readFromDb(key,valueId);
		res.status(200).send(data);
	} catch (err) {
		console.log(err);
	}
});
// add a quote
app.post('/quotes', async (req, res) => {
	try {
		const reqBody = req.body;
       
		writeToDb(reqBody.quoteId, reqBody.title, reqBody.author, reqBody.quote);
        // TODO: show string in req to tell user that quote has been added/POSTed
        res.status(201).send({message:`${reqBody.quoteId} has been added`,reqBody})
 
		
	} catch (err) {
		console.log(err);
	}
    // TODO: refreshing post page will keep sending post request/write to db
});


// update a quote
app.patch('/quotes/:id', async (req, res) => {
    let quoteId=req.params.id
    
	try {
		const reqBody = req.body;
		writeToDb(reqBody.quoteId, reqBody.title, reqBody.author, reqBody.quote);
        // TODO change to reqbody
        res.status(201).redirect(`/quotes/${reqBody.quoteId}`)
	} catch (err) {
		console.log(err);
	}
})


// delete a quote
app.delete('/quotes/:id', async (req, res) => {
    let quoteId=req.params.id
    console.log("deleting...",quoteId)
	try {
        deleteFromDb(quoteId)
        res.status(202).send({message:`${quoteId} has been deleted`})
	} catch (err) {
		console.log(err);
	}
});


// moongose / Mongodb
mongoose.connect(process.env.dburi);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.error('Connected to db'));

// read all documents from db


const readFromDb = async (key,value) => {
     console.log('read from db')
     if(key!=undefined && value!=undefined){
        return await Quotes.findOne({[key]:value})
    }else{
        return await Quotes.find().lean();
    }
};

// helps to write to db. Upsert helps with adding if not found, or update if found.
const writeToDb = async (quoteId, title, author, quote) => {
    console.log('write to db')
	const query = { quoteId: quoteId };
	const update = {
		$set: {
			quoteId: quoteId,
			title: title,
			author: author,
			quote: quote
		}
	};
	return await Quotes.findOneAndUpdate(query, update, { upsert: true });
};

const deleteFromDb=async (quoteId) => {
    const query = { quoteId: quoteId };
    return await Quotes.findOneAndDelete(query);
}


// TODO: sort quotes in get route by quoteId
const sorter=(data,params,type)=>{
    // either 'asc' or 'desc'
    return data.sort((a,b)=>(type==='asc'? a[params]-b[params]:b[params]-a[params]))

}