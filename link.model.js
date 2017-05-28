"use strict"

const mongoose = require('mongoose');


let Schema = new mongoose.Schema({
	url: {
		type: String,
		lowercase: true
	},
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	image: {
		type: String,
		lowercase: true
	}
})

module.exports = Schema;
