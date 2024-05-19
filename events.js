const axios = require("axios"); 
const cheerio = require("cheerio"); 

const api = axios.create({
    baseURL: "https://www.ticketone.it/artist",
    headers: {
        'Content-type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
	'Accept-Language': 'en,it;q=0.5',
	'Connection': 'keep-alive',
	'Upgrade-Insecure-Requests': '1',
        Accept: 'text/html',
	'Pragma': 'no-cache',
	'Cache-Control': 'no-cache',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
        'accept-encoding': 'gzip, deflate, br',
    },
    options: {
        responseType: 'arraybuffer',
        decompress: true
    }
});

function events(artist) {
    return api.get(artist)
    .then(res => cheerio.load(res.data))
    .then($ => {
        let dict = []
        // main event set
        $("article.listing").each((i, el) => {
            const eventUri = (cheerio.load(el)("div.listing-item"))[0].attribs['onclick'].split('\'')[1].split('/').slice(-2)[0]
            dict.push({
                id: el.attribs['data-teaser-id'],
                name: el.attribs['data-teaser-name'],
                uri: eventUri,
                cover: cheerio.load(el)("div.listing-item>div.listing-image-wrapper>img")[0].attribs['src']
            })
        })

        return dict
    })
}

function singleEvent(artist, eventUri){
    return api.get(artist+"/"+eventUri)
    .then(res => cheerio.load(res.data))
    .then($ => {
        const textRootElement = $(".container.artwork-content > .artwork-content-text > .stage-content-text")
        return {
            name: textRootElement.find("h1.stage-headline").text(),
            cover: $("img.stage-blurred-image").attr("src"),
        }
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
            let city_element = cheerio.load(eventDateInfo)("div.event-listing-info>div.event-listing-info-inner>h2").text()
            let event_element = eventDateInfo.attribs['data-teaser-name']
            if (city_element === event_element) {
                event_element = city_element
                city_element = cheerio.load(eventDateInfo)("div.event-listing-info>div.event-listing-info-inner>ul>li.event-listing-venue").text()
            }
            arr.push({
                id: eventDateInfo.attribs['data-event-id'],
                name: event_element,
                uri: eventDateInfo.attribs['onclick'].match(/\/event\/.*\//)[0],
                city: city_element,
                date: new Date( cheerio.load(el)("div.listing-container>article.listing-item>div.event-listing-link-wrapper>div.event-listing-date-box>div>time")[0].attribs['datetime'] )
            })
        })
        return arr
    })
}

module.exports = {
    getEvents: events,
    getTickets: tickets,
    getCover: singleEvent
}
