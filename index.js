const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const mongoose = require('mongoose');
// import from model/Quote
const Quotes = require('./models/Quote');

app.set('json spaces', 2);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(port, () => console.log('listening on port 3000'));

// home page
app.get('/', async (req, res) => {
	const data = await readFromDb();
	try {
		// res.send(data);
		res.sendFile(__dirname + '/public/index.html');
	} catch (err) {
		console.log(err);
	}
});

// get all quotes
app.get('/quotes', async (req, res) => {
	const data = await readFromDb();
	res.send(sorter(data,'quoteId','asc'));
});

// get single quote
app.get('/quotes/:id', async (req, res) => {
	let quoteId = req.params.id;
	const data = await readFromDb(quoteId);
	try {
		res.send(data);
	} catch (err) {
		console.log(err);
	}
});

// add a post
app.post('/quotes', async (req, res) => {
	try {
		const reqBody = req.body;
        console.log(reqBody);
		writeToDb(reqBody.quoteId, reqBody.title, reqBody.author, reqBody.quote);
		res.redirect(`/quotes/${reqBody.quoteId}`);
	} catch (err) {
		console.log(err);
	}
});

// update a post
app.put('/quotes/:id', async (req, res) => {
	let quoteId = req.params.id;
	try {
		const reqBody = req.body;
		writeToDb(reqBody.quoteId, reqBody.title, reqBody.author, reqBody.quote);
	} catch (err) {
		console.log(err);
	}
});
// delete a post
app.delete('/quotes/:id', async (req, res) => {
	let quoteId = req.params.id;
	const reqBody = req.body;
	try {
		deleteFromDb(quoteId);
        res.json({ message: `Deleted ${quoteId}` });
	} catch (err) {
		console.log(err);
	}
});

// moongose / Mongodb
mongoose.connect(process.env.dburi);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.error('Connected to db'));

// read from db
const readFromDb = async (quoteId) => {
	if (quoteId) {
		return await Quotes.findOne({ quoteId: quoteId });
	} else {
		return await Quotes.find().lean();
	}
};

// write to or update db (upsert helps with update [if not found, add it. if found, update it])
const writeToDb = async (quoteId, title, author, quote) => {
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

const deleteFromDb = async (quoteId) => {
	const query = { quoteId: quoteId };
	return await Quotes.findOneAndDelete(query);
};

const sorter = (array,params,type) => {
        return array.sort((a, b) => (type === 'asc' ? a[params] - b[params] : b[params] - a[params]));
	
};
