const e = require("./events.js")

// e.getEvents("pinguini-tattici-nucleari").then(console.log)
// e.getEvents("geolier").then(console.log)
// e.getTickets("geolier","geolier-3124039").then(console.log)
// e.getEvents("tedua").then(console.log)
// e.getEvents("vasco-rossi").then(console.log)

// e.getEvents("asasa").then(console.log).catch(err => {console.log(err.response.status)})



const express = require('express')
const app = express()
const port = 3000

app.get('/artist/:artist', (req, res) => {
    e.getEvents(req.params.artist)
    .then(async events => {
        if (events.length == 0) res.statusCode(404)
        res.send(events)
    })
    .catch(err => {
        res.status(400).send()
    })
})

app.get('/event/:event', (req, res) => {
    e.getTickets(req.params.event)
    .then(dates => {
        if (dates.length == 0) res.statusCode(404)
        res.send(
            dates
        )
    })
    .catch(err => {
        res.status(400).send()
    })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
