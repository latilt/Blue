var express = require('express')
var app = express()

app.listen('3000', function() {
  console.log("Server Start Port 3000!")
})

app.get('/', function(req, res) {
  res.send('<h1>Hello World!</h1>')
})
