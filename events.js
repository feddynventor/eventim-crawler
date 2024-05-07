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
        let dict = {}
        // main event set
        // $("article.listing,article.listing-item").each((i, el) => {
        $("article.listing").each((i, el) => {
            const eventUri = (cheerio.load(el)("div.listing-item"))[0].attribs['onclick'].split('\'')[1].split('/').slice(-2)[0]
            dict[el.attribs['data-teaser-id']] = {
                name: el.attribs['data-teaser-name'],
                uri: eventUri,
                cover: cheerio.load(el)("div.listing-item>div.listing-image-wrapper>img")[0].attribs['src']
            }
        })
        
        return dict
    })
}

function tickets(artist, eventUri){
    return api.get(artist+"/"+eventUri)
    .then(res => cheerio.load(res.data))
    .then($ => {
        let arr = []
        $("div#tickets>div>div.listing-item-wrapper-inside-card")
        .each((i,el)=>{
            const eventDateInfo = cheerio.load(el)("div.listing-container>article.listing-item>div.event-listing-link-wrapper>div.event-listing-info-wrapper>div.event-listing-info")[0]
            arr.push({
                id: eventDateInfo.attribs['data-event-id'],
                name: eventDateInfo.attribs['data-teaser-name'],
                uri: eventDateInfo.attribs['onclick'].match(/\/event\/.*\//)[0],
                city: cheerio.load(eventDateInfo)("div.event-listing-info>div.event-listing-info-inner>h2").text(),
                date: new Date( cheerio.load(el)("div.listing-container>article.listing-item>div.event-listing-link-wrapper>div.event-listing-date-box>div>time")[0].attribs['datetime'] )
            })
        })
        return arr
    })
}

module.exports = {
    getEvents: events,
    getTickets: tickets
}