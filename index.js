'use strict'

const express = require('express');

const port = process.env.PORT || 3000;

const app = express()

app.use(express.static(__dirname + '/public'));

app.use("/links", require("./link.controller"))

app.listen(port, () => {
	console.log('Magic happens at port ' + port);
})
