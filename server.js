require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const { Client } = require('@googlemaps/google-maps-services-js');
const API_KEY = process.env.API_KEY;

const server = express();
server.use(cors()); //To enable cross origin resource sharing
server.use(express.json()); //To be able to accept input from front-end

server.use(express.static(path.join(__dirname, 'client/build')));

server.get('/', async function (req, res) {
	res.sendFile(path.join(__dirname, 'client', '/build/index.html'));
});

server.post('/searchAPI', async (req, res) => {
	try {
		let { searchElement, latitude, longitude, radius } = req.body;

		const client = new Client({});

		const apiResponse = await client.textSearch({
			params: {
				query: searchElement,
				location: [latitude, longitude],
				radius: radius || 50000,
				key: API_KEY,
			},
		});

		return res.send({
			searchResults: apiResponse.data.results,
			nextPageToken: apiResponse.data.next_page_token,
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

server.post('/searchAPI/next', async (req, res) => {
	try {
		const client = new Client({});

		const apiResponse = await client.textSearch({
			params: {
				// query: req.body.searchElement,
				// region: req.body.location,
				key: API_KEY,
				pagetoken: req.body.nextPageToken,
			},
		});
		return res.send({
			searchResults: apiResponse.data.results,
			nextPageToken: apiResponse.data.next_page_token,
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

// Server initialization on port 5000
server.listen(process.env.PORT || 5000, () => {
	console.log(`Server Started on port ${process.env.PORT || 5000}`);
});
