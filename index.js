const e = require("./events.js")

// e.getEvents("pinguini-tattici-nucleari").then(console.log)
// e.getEvents("geolier").then(console.log)
// e.getTickets("geolier","geolier-3124039").then(console.log)
// e.getEvents("tedua").then(console.log)
// e.getEvents("vasco-rossi").then(console.log)

e.getEvents("asasa").then(console.log).catch(err => {console.log(err.response.status)})