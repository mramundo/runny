import type { Lang } from './types'

/* ============================================================
   Runny — copy.
   `en` is the source of truth; `it` is typed against it, so a
   missing or stray key is a compile error rather than a blank UI.
   ============================================================ */

const en = {
  langName: 'English',
  brandTag: 'the right hour to run',

  nav: {
    plan: 'Planner',
    faq: 'FAQ',
    backToPlanner: 'Back to the planner',
  },

  hero: {
    kicker: 'Run planner',
    titleA: 'Every run has',
    titleB: 'a right hour.',
    lead: 'Runny checks the forecast along the whole route you have in mind, hour by hour, and tells you which slots are actually worth going out for.',
    cta: 'Start',
    ghost: 'How it works',
  },

  start: {
    kicker: '01 — Start',
    title: 'Where you set off',
    placeholder: 'Street, park, square…',
    useGps: 'Use my location',
    locating: 'Locating you',
    clear: 'Clear',
    searching: 'Searching',
    noResults: 'Nothing found. Try another spelling.',
    yourLocation: 'My location',
    hint: 'Everything below is built from this point.',
    ready: 'Start set',
  },

  mode: {
    kicker: '02 — Your run',
    title: 'What kind of run',
    loopTab: 'Back to the start',
    abTab: 'Finish elsewhere',
    loopLead: 'Say how far you want to go and Runny proposes three routes that leave from here and come back.',
    abLead: 'Tell Runny where you want to end up and it works out the route.',
    endLabel: 'Finish',
    endPlaceholder: 'Street, park, square…',
    paceLabel: 'Your pace',
    paceUnit: 'min/km',
    paceHint: 'Decides how long the good conditions have to hold.',
    submit: 'Find my windows',
    submitting: 'Checking the forecast',
    needStart: 'Pick a starting point first.',
  },

  suggest: {
    building: 'Working out the routes',
    failed: 'No route of that length fits around here. Try another distance or another start.',
    pick: 'Use this route',
    loopName: {
      n: 'Northbound',
      ne: 'North-east',
      e: 'Eastbound',
      se: 'South-east',
      s: 'Southbound',
      sw: 'South-west',
      w: 'Westbound',
      nw: 'North-west',
    },
    targetNote: 'target',
  },

  route: {
    kicker: '03 — Route',
    title: 'Your route',
    distance: 'Distance',
    duration: 'Estimated time',
    ascent: 'Climb',
    samples: 'Forecast read at',
    samplesUnit: 'points',
    samplesHint: 'The forecast is read at these points along the route and averaged across them.',
    legendStart: 'Start',
    legendEnd: 'Finish',
    mapAria: 'Map of the planned running route',
    attribution: '© OpenStreetMap contributors',
  },

  windows: {
    kicker: '04 — Windows',
    title: 'When to go',
    lead: 'Slots long enough to hold the whole run, ordered from the one where the air costs you least.',
    windowLength: 'Window',
    best: 'Best slot',
    alternatives: 'These work too',
    perDay: 'Best of each day',
    none: 'Nothing comfortable in the next few days. Go early, go slow, take water.',
    nightToggle: 'Allow night hours',
    nightHint: 'Otherwise only between 05:00 and 22:00.',
    scoreLabel: 'Index',
    scoreAria: 'Runny index for this slot',
    today: 'Today',
    tomorrow: 'Tomorrow',
    feelsLike: 'Feels like',
    rainChance: 'Rain',
    windLabel: 'Wind',
    uvLabel: 'UV',
    humidityLabel: 'Humidity',
    hourly: 'Hour by hour',
    hourlyAria: 'Hourly Runny index along the route',
    now: 'Now',
    legend: 'Index scale',
  },

  bands: {
    perfect: 'Ideal',
    great: 'Good',
    ok: 'Workable',
    poor: 'Hard',
    bad: 'Better not',
  },

  verdicts: {
    perfect: 'Cool, clean air. This is the slot to take.',
    great: 'Good conditions — the weather will not get in your way.',
    ok: 'You can run it, but you will feel the effort.',
    poor: 'Better to shorten it or move the time.',
    bad: 'Not worth it. Wait for a better slot.',
  },

  faq: {
    kicker: 'FAQ',
    title: 'Behind the numbers',
    lead: 'What every figure on this page actually means, and where it comes from.',
    outro: 'Runny picks the hour. The legs are still up to you.',
    items: [
      {
        q: 'Why check the whole route instead of one place?',
        a: 'A long run leaves the neighbourhood. It climbs, it crosses water, it swaps shade for open road. The conditions at the far end are not the conditions outside your door, so Runny reads several points spread along the route and averages them. What comes back describes the run you are about to do, not the roof you are standing under.',
      },
      {
        q: 'What is the index?',
        a: 'A single number from 0 to 100 for each hour, answering one question: how much will the conditions cost you. High means the weather is on your side. Low means the same session will hurt more, take longer, or leave you flat the next day.',
      },
      {
        q: 'What moves it the most?',
        a: 'Heat, and not the number on the thermometer. Runny starts from how hot the air feels once sun and wind are taken into account, together with how much moisture it is carrying. Those two set the ceiling. Rain, wind and sun exposure can only bring the number down from there — none of them ever makes a hard run easy.',
      },
      {
        q: 'Why does a mild day sometimes score badly?',
        a: 'Because the air is saturated. When humidity is high, sweat stops evaporating and your body loses the way it cools itself, so 20 degrees can punish you more than a dry 26. It is the most underrated factor in endurance running, and it is why two days at the same temperature can be twenty points apart.',
      },
      {
        q: 'How long is a window?',
        a: 'Exactly as long as your run. Runny takes the distance of the route, applies the pace you set, rounds up to whole hours, and only shows stretches where every one of those hours holds. A single good hour with a storm right behind it is not a window.',
      },
      {
        q: 'Where do the suggested routes come from?',
        a: 'Name a distance and Runny places points in a ring around your start, threads a runnable route through them, measures what it actually got, then tightens or widens the ring and tries again until the length lands where you asked. Three routes are drawn in different directions so the choice is a real one. Every metre follows roads and paths you can genuinely run.',
      },
      {
        q: 'Why these distances?',
        a: 'They are the sessions a half or full marathon block is really made of: short and fast for speed, eight to twelve for the everyday runs, sixteen to twenty-one for the long work of a half, twenty-eight to thirty-five for a marathon build, and the two race distances themselves.',
      },
      {
        q: 'How reliable is the forecast?',
        a: 'Tomorrow morning is close to certain, the day after is solid, four days out is a direction rather than a promise. Check again the evening before a session that matters.',
      },
      {
        q: 'What happens to my location?',
        a: 'It is used to answer your question and nothing else. There is no account, no profile, no analytics and no advertising. The last route you planned stays on your own device, and clearing the site data clears it.',
      },
      {
        q: 'Can I keep it on my phone?',
        a: 'Yes. Add it to your home screen and it opens like any other app, full screen and even without a connection, still showing the last answer it gave you. Planning something new needs a connection; reading the old plan does not.',
      },
    ],
  },

  footer: {
    blurb: 'The forecast along your route, hour by hour, reduced to one decision: go now, or go later.',
    sitemap: 'Pages',
    linkPlan: 'Planner',
    linkFaq: 'FAQ',
    copy: '© 2026 Runny',
    made: 'For people who would rather not melt.',
  },

  errors: {
    geoUnsupported: 'This browser will not share a location. Type your starting point instead.',
    geoDenied: 'Location permission refused. Type your starting point instead.',
    geoFailed: 'Could not work out where you are. Type your starting point instead.',
    search: 'Place search is not responding. Try again in a moment.',
    route: 'No runnable route fits between those two points. Move one of them.',
    routeSame: 'Start and finish are the same point. Switch to “Back to the start”.',
    weather: 'The forecast cannot be reached right now.',
    generic: 'Something went wrong.',
    retry: 'Try again',
  },

  units: {
    km: 'km',
    m: 'm',
    kmh: 'km/h',
    pct: '%',
    deg: '°',
  },

  wmo: {
    0: 'Clear',
    1: 'Mostly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Freezing fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Heavy drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Freezing rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light showers',
    81: 'Showers',
    82: 'Violent showers',
    85: 'Snow showers',
    86: 'Snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm, hail',
    99: 'Thunderstorm, hail',
  } as Record<number, string>,
}

type Dict = typeof en

const it: Dict = {
  langName: 'Italiano',
  brandTag: 'l’ora giusta per correre',

  nav: {
    plan: 'Pianifica',
    faq: 'FAQ',
    backToPlanner: 'Torna a pianificare',
  },

  hero: {
    kicker: 'Pianificatore di corse',
    titleA: 'Ogni corsa ha',
    titleB: 'la sua ora.',
    lead: 'Runny controlla le previsioni lungo tutto il percorso che hai in mente, ora per ora, e ti dice in quali fasce conviene davvero uscire.',
    cta: 'Comincia',
    ghost: 'Come funziona',
  },

  start: {
    kicker: '01 — Partenza',
    title: 'Da dove parti',
    placeholder: 'Via, parco, piazza…',
    useGps: 'Usa la mia posizione',
    locating: 'Ti sto localizzando',
    clear: 'Cancella',
    searching: 'Cerco',
    noResults: 'Nessun risultato. Prova a scriverlo in un altro modo.',
    yourLocation: 'La mia posizione',
    hint: 'Tutto quello che c’è sotto parte da qui.',
    ready: 'Partenza impostata',
  },

  mode: {
    kicker: '02 — La corsa',
    title: 'Che corsa vuoi fare',
    loopTab: 'Torno alla partenza',
    abTab: 'Arrivo altrove',
    loopLead: 'Dì quanti chilometri vuoi fare e Runny ti propone tre percorsi che partono da qui e ci tornano.',
    abLead: 'Dì a Runny dove vuoi arrivare e ci pensa lui a calcolare il percorso.',
    endLabel: 'Arrivo',
    endPlaceholder: 'Via, parco, piazza…',
    paceLabel: 'Il tuo passo',
    paceUnit: 'min/km',
    paceHint: 'Stabilisce per quanto devono durare le condizioni buone.',
    submit: 'Trova le fasce',
    submitting: 'Controllo le previsioni',
    needStart: 'Prima scegli un punto di partenza.',
  },

  suggest: {
    building: 'Sto calcolando i percorsi',
    failed: 'Non c’è un percorso di quella lunghezza qui intorno. Prova un’altra distanza o un’altra partenza.',
    pick: 'Usa questo percorso',
    loopName: {
      n: 'Verso nord',
      ne: 'Verso nord-est',
      e: 'Verso est',
      se: 'Verso sud-est',
      s: 'Verso sud',
      sw: 'Verso sud-ovest',
      w: 'Verso ovest',
      nw: 'Verso nord-ovest',
    },
    targetNote: 'obiettivo',
  },

  route: {
    kicker: '03 — Percorso',
    title: 'Il tuo percorso',
    distance: 'Distanza',
    duration: 'Tempo stimato',
    ascent: 'Dislivello',
    samples: 'Previsioni lette in',
    samplesUnit: 'punti',
    samplesHint: 'Le previsioni vengono lette in questi punti lungo il percorso e poi mediate.',
    legendStart: 'Partenza',
    legendEnd: 'Arrivo',
    mapAria: 'Mappa del percorso di corsa',
    attribution: '© contributori OpenStreetMap',
  },

  windows: {
    kicker: '04 — Fasce',
    title: 'Quando uscire',
    lead: 'Fasce abbastanza lunghe da contenere tutta la corsa, ordinate a partire da quella in cui le condizioni ti pesano di meno.',
    windowLength: 'Fascia',
    best: 'La fascia migliore',
    alternatives: 'Vanno bene anche queste',
    perDay: 'La migliore di ogni giorno',
    none: 'Nei prossimi giorni non c’è niente di comodo. Esci presto, vai piano e porta acqua.',
    nightToggle: 'Considera anche le ore notturne',
    nightHint: 'Altrimenti solo fra le 05:00 e le 22:00.',
    scoreLabel: 'Indice',
    scoreAria: 'Indice Runny di questa fascia',
    today: 'Oggi',
    tomorrow: 'Domani',
    feelsLike: 'Percepita',
    rainChance: 'Pioggia',
    windLabel: 'Vento',
    uvLabel: 'UV',
    humidityLabel: 'Umidità',
    hourly: 'Ora per ora',
    hourlyAria: 'Indice Runny orario lungo il percorso',
    now: 'Adesso',
    legend: 'Scala dell’indice',
  },

  bands: {
    perfect: 'Ideale',
    great: 'Buona',
    ok: 'Fattibile',
    poor: 'Dura',
    bad: 'Meglio no',
  },

  verdicts: {
    perfect: 'Aria fresca e pulita: è questa la fascia da prendere.',
    great: 'Condizioni buone, il meteo non ti darà fastidio.',
    ok: 'Si corre, ma la fatica si sente.',
    poor: 'Meglio accorciare il giro o spostare l’orario.',
    bad: 'Non ne vale la pena: aspetta una fascia migliore.',
  },

  faq: {
    kicker: 'FAQ',
    title: 'Dietro i numeri',
    lead: 'Che cosa significa davvero ogni dato di questa pagina e da dove arriva.',
    outro: 'Runny sceglie l’ora. Le gambe restano affar tuo.',
    items: [
      {
        q: 'Perché controllare tutto il percorso e non un punto solo?',
        a: 'Un lungo esce dal quartiere: sale, attraversa il fiume, lascia l’ombra per l’asfalto aperto. Le condizioni dall’altra parte non sono quelle sotto casa tua, così Runny legge più punti distribuiti lungo il percorso e ne fa la media. Quello che ottieni descrive la corsa che stai per fare, non il tetto sopra la tua testa.',
      },
      {
        q: 'Che cos’è l’indice?',
        a: 'Un numero da 0 a 100 per ogni ora, che risponde a una domanda sola: quanto ti costeranno le condizioni. Alto vuol dire che il meteo è dalla tua parte. Basso vuol dire che la stessa seduta farà più male, durerà di più o ti lascerà svuotato il giorno dopo.',
      },
      {
        q: 'Che cosa pesa di più?',
        a: 'Il caldo, ma non quello scritto sul termometro. Runny parte da quanto l’aria è calda tenendo conto di sole e vento, insieme a quanta umidità porta con sé. Questi due fissano il tetto. Pioggia, vento ed esposizione al sole possono solo abbassare il numero: nessuno dei tre rende facile una corsa difficile.',
      },
      {
        q: 'Perché una giornata mite a volte va male?',
        a: 'Perché l’aria è satura. Quando l’umidità è alta il sudore non evapora e il corpo perde il modo che ha per raffreddarsi, così 20 gradi ti puniscono più di 26 asciutti. È il fattore più sottovalutato nella corsa di resistenza ed è il motivo per cui due giornate con la stessa temperatura possono avere venti punti di differenza.',
      },
      {
        q: 'Quanto dura una fascia?',
        a: 'Esattamente quanto la tua corsa. Runny prende la lunghezza del percorso, applica il passo che hai impostato, arrotonda alle ore piene e mostra solo i tratti in cui tutte quelle ore reggono. Un’ora buona con un temporale subito dopo non è una fascia.',
      },
      {
        q: 'Da dove arrivano i percorsi consigliati?',
        a: 'Scegli una distanza e Runny dispone dei punti in un anello attorno alla tua partenza, ci fa passare un percorso corribile, misura quello che è venuto fuori, poi stringe o allarga l’anello e riprova finché la lunghezza non arriva dove l’hai chiesta. I percorsi proposti sono tre, in direzioni diverse, così la scelta è davvero una scelta. Ogni metro segue strade e sentieri che si possono correre.',
      },
      {
        q: 'Perché proprio queste distanze?',
        a: 'Sono le sedute con cui si costruisce davvero una mezza o una maratona: poco e veloce per la velocità, dagli otto ai dodici per le corse di tutti i giorni, dai sedici ai ventuno per i lunghi di una mezza, dai ventotto ai trentacinque per la preparazione alla maratona, più le due distanze di gara.',
      },
      {
        q: 'Quanto sono affidabili le previsioni?',
        a: 'Domani mattina è quasi certa, dopodomani è solida, a quattro giorni è un’indicazione più che una promessa. Prima di una seduta importante, ricontrolla la sera prima.',
      },
      {
        q: 'Che fine fa la mia posizione?',
        a: 'Serve a rispondere alla tua domanda e a nient’altro. Non c’è nessun account, nessun profilo, nessun tracciamento e nessuna pubblicità. L’ultimo percorso che hai pianificato resta sul tuo dispositivo e sparisce se cancelli i dati del sito.',
      },
      {
        q: 'Posso tenerlo sul telefono?',
        a: 'Sì. Aggiungilo alla schermata home e si apre come qualsiasi altra app, a tutto schermo e anche senza connessione, mostrandoti l’ultima risposta che ti aveva dato. Per pianificare qualcosa di nuovo serve la rete, per rileggere il vecchio percorso no.',
      },
    ],
  },

  footer: {
    blurb: 'Le previsioni lungo il tuo percorso, ora per ora, ridotte a una sola decisione: esco adesso o esco dopo.',
    sitemap: 'Pagine',
    linkPlan: 'Pianifica',
    linkFaq: 'FAQ',
    copy: '© 2026 Runny',
    made: 'Per chi preferirebbe non sciogliersi.',
  },

  errors: {
    geoUnsupported: 'Questo browser non condivide la posizione. Scrivi la partenza a mano.',
    geoDenied: 'Permesso di posizione negato. Scrivi la partenza a mano.',
    geoFailed: 'Non riesco a capire dove sei. Scrivi la partenza a mano.',
    search: 'La ricerca dei luoghi non risponde. Riprova tra un momento.',
    route: 'Non c’è un percorso corribile fra quei due punti. Spostane uno.',
    routeSame: 'Partenza e arrivo coincidono. Passa a “Torno alla partenza”.',
    weather: 'Le previsioni non sono raggiungibili in questo momento.',
    generic: 'Qualcosa è andato storto.',
    retry: 'Riprova',
  },

  units: {
    km: 'km',
    m: 'm',
    kmh: 'km/h',
    pct: '%',
    deg: '°',
  },

  wmo: {
    0: 'Sereno',
    1: 'Quasi sereno',
    2: 'Poco nuvoloso',
    3: 'Coperto',
    45: 'Nebbia',
    48: 'Nebbia che gela',
    51: 'Pioviggine leggera',
    53: 'Pioviggine',
    55: 'Pioviggine intensa',
    56: 'Pioviggine gelata',
    57: 'Pioviggine gelata',
    61: 'Pioggia leggera',
    63: 'Pioggia',
    65: 'Pioggia forte',
    66: 'Pioggia gelata',
    67: 'Pioggia gelata',
    71: 'Neve leggera',
    73: 'Neve',
    75: 'Neve forte',
    77: 'Granelli di neve',
    80: 'Rovesci leggeri',
    81: 'Rovesci',
    82: 'Rovesci violenti',
    85: 'Rovesci di neve',
    86: 'Rovesci di neve',
    95: 'Temporale',
    96: 'Temporale con grandine',
    99: 'Temporale con grandine',
  },
}

export const DICTS: Record<Lang, Dict> = { en, it }

export type Strings = Dict

export function t(lang: Lang): Dict {
  return DICTS[lang]
}

export const DATE_LOCALE: Record<Lang, string> = { en: 'en-GB', it: 'it-IT' }
