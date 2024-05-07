const axios = require("axios"); 
const cheerio = require("cheerio"); 

const api = axios.create({
    baseURL: "https://www.ticketone.it/artist",
    headers: {
        'Content-type': 'text/html',
        Accept: 'text/html',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
    },
});

function events(artist) {
    return api.get(artist)
    .then(res => cheerio.load(res.data))
    .then($ => {
        const eventSelector = $("div.listing-item.listing-item-clickable")//.forEach(console.log);
        eventSelector.each((i, el) => {
            // console.log(el.attr('onclick'))
            console.log(el.attribs['onclick'].split('\'')[1].split('/').slice(-2)[0])
        })
    })
}

module.exports = {
    getEvents: events
}