# eventim \ ticketone
### artist's event crawler

The main API server endpoint requires the artist name. Whitespaces are mapped as `-` as in the original website URLs

The second endpoint requires `/:artist/:eventuri` and crawles the dates of the event

```
[
  {
    "id":"3579489",
    "name":"Annalisa - Tutti in Arena",
    "uri":"annalisa-tutti-in-arena-3579489",
    "cover":"/obj/media/IT-eventim/teaser/222x222/2024/annalisa-arena-biglietti-2.jpg",
    "dates":[
      {
        "id":"18338286",
        "name":"Annalisa",
        "uri":"/event/annalisa-tutti-in-arena-arena-di-verona-18338286/",
        "city":"VERONA",
        "date":"2024-05-20T19:00:00.000Z"
      },
      ...
      ]
  },
  ...
]
```

### TODO
- pages management
- sometimes the city is swapped with the event name so dates crawler is not perfect
