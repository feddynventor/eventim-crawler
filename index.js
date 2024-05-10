const e = require("./events.js")
const express = require('express')

const app = express()
const root = process.env["ROOT"] || ""

app.get(root+'/:artist', (req, res) => {
    e.getEvents(req.params.artist)
    .then(async events => {
        if (events.length == 0) res.statusCode(404)
        res.send(await Promise.all(events.map( async event => ({
            ...event,
            dates: await e.getTickets(req.params.artist, event.uri)
        }))))
    })
    .catch(err => {
        res.status(400).send(err)
    })
})

app.get(root+'/:artist/:event', (req, res) => {
    e.getTickets(req.params.artist, req.params.event)
    .then(dates => {
        if (dates.length == 0) res.statusCode(404)
        res.send(dates)
    })
    .catch(err => {
        res.status(400).send(err)
    })
})

app.listen(3000, () => {
  console.log(`Listening on port 3000`)
})
