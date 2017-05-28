"use strict"

const express = require("express");
const mongoose = require("mongoose");

const request = require('request-promise');

const db = mongoose.createConnection(process.env.MONGO_URL)
const Link = db.model("Link", require("./link.model.js"));

let router = express.Router();

router.get('/', (req, res) => {
	Link.find({})
		.then((results) => {
			res.send(results);
		})
		.catch((err) => {
			res.status(500)
			res.send(err)
		})
})



let getLinkInfo = (url) => {
	return request(url)
		.then(function(html) {
			var image = html.match(/<meta property="og:image" content=\"(.*?)\">/);
			var title = html.match(/<meta property="og:title" content=\"(.*?)\">/);
			var description = html.match(/<meta property="og:description" content=\"(.*?)\">/);

			return {
				image: (image && image.length) > 1 ? image[1] : "",
				title: (title && title.length) > 1 ? title[1] : "",
				description: (description && description.length) > 1 ? description[1] : ""
			}
		})
}

let validUrl = (link) => {
	var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return urlregex.test(link);
}

router.post('/', (req, res) => {
	let link = req.query.link;

	if (link && link.length && validUrl(link)) {
		getLinkInfo(link)
			.then((info) => {
				return Link.create({
					url: link,
					title: info.title,
					description: info.description,
					image: info.image
				})
			})
			.then((result) => {
				res.status(200);
				res.send(result)
			})
			.catch((err) => {
				res.status(500)
				res.send(err)
			})
	} else {
		res.status(401)
		res.send("Invalid URL");
	}
})

router.delete('/:id', (req, res) => {
	let id = req.params.id;

	if (id) {
		Link.findByIdAndRemove(id)
			.then((result) => {
				res.status(200);
				res.send(result)
			})
			.catch((err) => {
				res.status(500)
				res.send(err)
			})
	} else {
		res.status(401)
		res.send({
			error: "No ID."
		})
	}
})

module.exports = router;
