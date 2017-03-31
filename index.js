'use strict'

const express = require('express');
const request = require('request-promise');

let getLinkInfo = function(url) {
	return request(url)
		.then(function(html) {
			var image = (html.match(/<meta property="og:image" content=\"(.*?)\">/))[1];
			var title = (html.match(/<meta property="og:title" content=\"(.*?)\">/))[1];
			var description = (html.match(/<meta property="og:description" content=\"(.*?)\">/))[1];

			return {
				image,
				title,
				description
			}
		})
		.catch(function(err) {});
}

var app = express()

app.get('/', function(req, res) {
	let link = req.query.link;

	if (link) {
		getLinkInfo(link)
			.then((info) => {
				var page = `<html><head><style>img {height:200px;}</style></head><body><img src="${info.image}"><h1>${info.title}</h1><p>${info.description}</p></body></html>`

				res.send(page);
			});
	} else {
		res.send("Nothing here.");
	}
})

app.listen(3000)
