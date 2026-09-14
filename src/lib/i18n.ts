import type { Lang } from './types'

/* ============================================================
   Runny — copy deck.
   `en` is the source of truth; `it` is typed against it, so a
   missing or stray key is a compile error rather than a blank UI.
   ============================================================ */

const en = {
  langName: 'English',
  brandTag: 'run cool, not cooked',

  nav: {
    plan: 'Plan',
    windows: 'Best hours',
    faq: 'FAQ',
    backToPlanner: 'Back to the planner',
  },

  hero: {
    titleA: 'Run when the air',
    titleB: 'is on your side.',
    lead: 'Runny reads the forecast along your whole route — not just your postcode — and hands you the coolest, freshest windows to head out.',
    cta: 'Plan my run',
    ghost: 'How it works',
    badge1: 'No sign-up',
    badge2: 'Works offline',
    badge3: 'Free forever',
  },

  planner: {
    title: 'Your route',
    kicker: 'Step 1',
    startLabel: 'Start',
    startPlaceholder: 'Where do you set off?',
    endLabel: 'Finish',
    endPlaceholder: 'Where do you finish?',
    loopToggle: 'Finish where I started',
    loopHint: 'Runny will build a loop back to your start.',
    useGps: 'Use my location',
    locating: 'Finding you…',
    swap: 'Swap start and finish',
    clear: 'Clear',
    paceLabel: 'Your pace',
    paceUnit: 'min/km',
    paceHint: 'Sets how long a window has to stay good.',
    submit: 'Check the forecast',
    submitting: 'Reading the sky…',
    noResults: 'No place found. Try a different spelling.',
    searching: 'Searching…',
    yourLocation: 'Your location',
  },

  suggest: {
    title: 'Or let Runny pick',
    kicker: 'Shortcut',
    lead: 'Choose a distance and Runny builds loops that start and end at your start point.',
    needStart: 'Set a start point first — then pick a distance.',
    building: 'Drawing loops…',
    failed: 'Could not build loops around here. Try another start point or distance.',
    pick: 'Use this route',
    loopName: {
      n: 'North loop',
      ne: 'North-east loop',
      e: 'East loop',
      se: 'South-east loop',
      s: 'South loop',
      sw: 'South-west loop',
      w: 'West loop',
      nw: 'North-west loop',
    },
    targetNote: 'target',
  },

  route: {
    title: 'Suggested route',
    kicker: 'Step 2',
    distance: 'Distance',
    duration: 'Est. time',
    ascent: 'Climb',
    samples: 'Forecast points',
    samplesHint: 'Weather is averaged across these points along the route.',
    legendStart: 'Start',
    legendEnd: 'Finish',
    mapAria: 'Map of the suggested running route',
    attribution: 'Map data © OpenStreetMap contributors · routing by Valhalla',
    openInOsm: 'Open in OpenStreetMap',
    recenter: 'Recentre',
  },

  windows: {
    title: 'Your best windows',
    kicker: 'Step 3',
    lead: 'Long enough for your run, ranked by how kind the air will be.',
    best: 'Top pick',
    alternatives: 'Other good slots',
    perDay: 'Best slot each day',
    none: 'Nothing comfortable in the next few days. Go early, go slow, take water.',
    nightToggle: 'Include night hours',
    nightHint: 'Off by default: 05:00–22:00 only.',
    scoreLabel: 'Runny Score',
    scoreAria: 'Runny Score for this window',
    today: 'Today',
    tomorrow: 'Tomorrow',
    feelsLike: 'Feels like',
    rainChance: 'Rain',
    windLabel: 'Wind',
    uvLabel: 'UV',
    humidityLabel: 'Humidity',
    startAt: 'Leave at',
    hourly: 'Hour by hour',
    hourlyAria: 'Hourly Runny Score along the route',
    now: 'Now',
    legend: 'Score legend',
  },

  bands: {
    perfect: 'Perfect',
    great: 'Great',
    ok: 'Doable',
    poor: 'Tough',
    bad: 'Skip it',
  },

  verdicts: {
    perfect: 'Crisp air, no excuses. Lace up.',
    great: 'Good conditions — you will barely notice the weather.',
    ok: 'Runnable, but you will feel it. Bring a bottle.',
    poor: 'Hard work. Shorten it or move it.',
    bad: 'Not worth the sweat. Wait for a better slot.',
  },

  faq: {
    title: 'How Runny works',
    lead: 'Short answers to the things people ask before their first run with it.',
    outro: 'Still stuck? Runny is a hobby project — open the repo and shout.',
    items: [
      {
        q: 'What does Runny actually do?',
        a: 'It takes the route you are going to run, samples the weather forecast at several points along it, averages those forecasts hour by hour, and scores every hour for how pleasant it will be to run in. Then it hands you the best windows that are long enough to fit your run.',
      },
      {
        q: 'Why average along the route instead of one location?',
        a: 'A 15 km run can leave a city, climb 200 m and cross a river. Sun, wind and humidity are not the same at the end as at the start. Runny samples up to eight points along the polyline so the score reflects the run you are actually doing.',
      },
      {
        q: 'What goes into the Runny Score?',
        a: 'Five things, weighted: apparent temperature (how hot it feels, not what the thermometer says), dew point (the real driver of how much you sweat), chance and amount of rain, wind, and UV. Thunderstorms, heavy rain and extreme heat cap the score no matter how good everything else looks.',
      },
      {
        q: 'Why dew point and not just humidity?',
        a: 'Relative humidity moves with temperature, so 80% at 8 °C and 80% at 28 °C feel nothing alike. Dew point is absolute: above roughly 16 °C your sweat stops evaporating properly and the run gets noticeably harder. It is the number endurance coaches actually watch.',
      },
      {
        q: 'How long is a "window"?',
        a: 'As long as your run. Runny multiplies your route distance by your pace, rounds up to whole hours, and only shows stretches where the whole run stays good — not a single pretty hour surrounded by rain.',
      },
      {
        q: 'Where do the suggested loops come from?',
        a: 'Pick a distance and Runny drops waypoints on a circle around your start, routes a pedestrian path through them, measures the real distance, then resizes the circle and tries again until the loop lands close to your target. Everything is real walkable/runnable ways from OpenStreetMap.',
      },
      {
        q: 'Why those distances?',
        a: 'They are the staples of half and full marathon training blocks: 5 and 10 km for tempo and intervals, 15 and 21.1 km for the long runs of a half build, 30 km as the classic marathon rehearsal, and 42.2 km because someone always asks.',
      },
      {
        q: 'Is my location sent anywhere?',
        a: 'Your coordinates go to the forecast, routing and geocoding services so they can answer — Open-Meteo, the OpenStreetMap Valhalla router and Photon. Nothing is stored by Runny, there is no account, no analytics and no tracking. Your last route stays in your own browser.',
      },
      {
        q: 'Does it work offline?',
        a: 'Runny installs as a PWA and keeps the app shell and your last forecast cached, so it opens and shows the last answer with no signal. New routes and fresh forecasts need a connection.',
      },
      {
        q: 'Should I trust it over how I feel?',
        a: 'No. It is a forecast, and forecasts are wrong sometimes. Runny picks the hours; you still decide whether your legs agree.',
      },
    ],
  },

  footer: {
    blurb: 'The forecast, along your route, turned into one answer: when to run so you do not melt.',
    sitemap: 'Sitemap',
    linkPlan: 'Planner',
    linkFaq: 'FAQ',
    linkRepo: 'Source code',
    data: 'Weather by Open-Meteo · routing by Valhalla on OpenStreetMap · search by Photon · tiles by CARTO',
    copy: '© 2026 Runny',
    joke: 'No liability for chafing.',
  },

  errors: {
    geoUnsupported: 'This browser has no geolocation. Type your start instead.',
    geoDenied: 'Location permission refused. Type your start instead.',
    geoFailed: 'Could not get your position. Type your start instead.',
    search: 'Place search is unavailable right now.',
    route: 'Could not build a route between those points. Try moving one of them.',
    routeSame: 'Start and finish are the same point. Turn on "Finish where I started" for a loop.',
    weather: 'The forecast service is unavailable right now.',
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
    0: 'Clear sky',
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
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with hail',
  } as Record<number, string>,
}

type Dict = typeof en

const it: Dict = {
  langName: 'Italiano',
  brandTag: 'corri fresco, non cotto',

  nav: {
    plan: 'Percorso',
    windows: 'Fasce migliori',
    faq: 'FAQ',
    backToPlanner: 'Torna al percorso',
  },

  hero: {
    titleA: 'Corri quando l’aria',
    titleB: 'è dalla tua parte.',
    lead: 'Runny legge le previsioni lungo tutto il percorso — non solo sopra casa tua — e ti dice le fasce più fresche per uscire.',
    cta: 'Pianifica la corsa',
    ghost: 'Come funziona',
    badge1: 'Nessuna registrazione',
    badge2: 'Funziona offline',
    badge3: 'Gratis per sempre',
  },

  planner: {
    title: 'Il tuo percorso',
    kicker: 'Passo 1',
    startLabel: 'Partenza',
    startPlaceholder: 'Da dove parti?',
    endLabel: 'Arrivo',
    endPlaceholder: 'Dove arrivi?',
    loopToggle: 'Arrivo dove sono partito',
    loopHint: 'Runny costruisce un anello che torna al punto di partenza.',
    useGps: 'Usa la mia posizione',
    locating: 'Ti sto cercando…',
    swap: 'Inverti partenza e arrivo',
    clear: 'Cancella',
    paceLabel: 'Il tuo passo',
    paceUnit: 'min/km',
    paceHint: 'Decide quanto a lungo la fascia deve restare buona.',
    submit: 'Guarda le previsioni',
    submitting: 'Leggo il cielo…',
    noResults: 'Nessun luogo trovato. Prova a scriverlo diversamente.',
    searching: 'Cerco…',
    yourLocation: 'La tua posizione',
  },

  suggest: {
    title: 'Oppure scegli Runny',
    kicker: 'Scorciatoia',
    lead: 'Scegli una distanza e Runny costruisce anelli che partono e tornano al tuo punto di partenza.',
    needStart: 'Prima imposta la partenza, poi scegli la distanza.',
    building: 'Disegno gli anelli…',
    failed: 'Non riesco a costruire anelli qui intorno. Prova un’altra partenza o un’altra distanza.',
    pick: 'Usa questo percorso',
    loopName: {
      n: 'Anello nord',
      ne: 'Anello nord-est',
      e: 'Anello est',
      se: 'Anello sud-est',
      s: 'Anello sud',
      sw: 'Anello sud-ovest',
      w: 'Anello ovest',
      nw: 'Anello nord-ovest',
    },
    targetNote: 'obiettivo',
  },

  route: {
    title: 'Percorso consigliato',
    kicker: 'Passo 2',
    distance: 'Distanza',
    duration: 'Tempo stimato',
    ascent: 'Dislivello',
    samples: 'Punti meteo',
    samplesHint: 'Il meteo è mediato su questi punti lungo il percorso.',
    legendStart: 'Partenza',
    legendEnd: 'Arrivo',
    mapAria: 'Mappa del percorso di corsa consigliato',
    attribution: 'Dati mappa © contributori OpenStreetMap · routing Valhalla',
    openInOsm: 'Apri in OpenStreetMap',
    recenter: 'Ricentra',
  },

  windows: {
    title: 'Le tue fasce migliori',
    kicker: 'Passo 3',
    lead: 'Lunghe abbastanza per la tua corsa, ordinate per quanto l’aria sarà gentile.',
    best: 'La migliore',
    alternatives: 'Altre fasce buone',
    perDay: 'La migliore di ogni giorno',
    none: 'Niente di comodo nei prossimi giorni. Esci presto, vai piano, porta acqua.',
    nightToggle: 'Includi le ore notturne',
    nightHint: 'Di default solo 05:00–22:00.',
    scoreLabel: 'Runny Score',
    scoreAria: 'Runny Score di questa fascia',
    today: 'Oggi',
    tomorrow: 'Domani',
    feelsLike: 'Percepita',
    rainChance: 'Pioggia',
    windLabel: 'Vento',
    uvLabel: 'UV',
    humidityLabel: 'Umidità',
    startAt: 'Parti alle',
    hourly: 'Ora per ora',
    hourlyAria: 'Runny Score orario lungo il percorso',
    now: 'Adesso',
    legend: 'Legenda del punteggio',
  },

  bands: {
    perfect: 'Perfetta',
    great: 'Ottima',
    ok: 'Fattibile',
    poor: 'Dura',
    bad: 'Lascia stare',
  },

  verdicts: {
    perfect: 'Aria frizzante, zero scuse. Allaccia le scarpe.',
    great: 'Buone condizioni: il meteo non lo sentirai quasi.',
    ok: 'Si corre, ma si sente. Porta la borraccia.',
    poor: 'Si soffre. Accorcia o sposta l’orario.',
    bad: 'Non vale il sudore. Aspetta una fascia migliore.',
  },

  faq: {
    title: 'Come funziona Runny',
    lead: 'Risposte brevi alle cose che tutti chiedono prima della prima corsa.',
    outro: 'Ancora dubbi? Runny è un progetto per hobby: apri il repo e fatti sentire.',
    items: [
      {
        q: 'Che cosa fa Runny, in pratica?',
        a: 'Prende il percorso che corri, campiona le previsioni meteo in più punti lungo di esso, le media ora per ora e dà a ogni ora un punteggio su quanto sarà piacevole correrci. Poi ti mostra le fasce migliori che sono abbastanza lunghe da contenere la tua corsa.',
      },
      {
        q: 'Perché mediare lungo il percorso invece di un solo punto?',
        a: 'Una corsa di 15 km può uscire dalla città, salire di 200 m e attraversare un fiume. Sole, vento e umidità non sono uguali all’arrivo e alla partenza. Runny campiona fino a otto punti lungo il tracciato, così il punteggio riguarda la corsa che fai davvero.',
      },
      {
        q: 'Cosa entra nel Runny Score?',
        a: 'Cinque fattori, pesati: temperatura percepita (quanto fa caldo davvero, non cosa dice il termometro), punto di rugiada (il vero motore del sudore), probabilità e quantità di pioggia, vento e UV. Temporali, pioggia forte e caldo estremo tagliano il punteggio comunque vada il resto.',
      },
      {
        q: 'Perché il punto di rugiada e non l’umidità?',
        a: 'L’umidità relativa si muove con la temperatura: 80% a 8 °C e 80% a 28 °C non si somigliano per niente. Il punto di rugiada è assoluto: sopra i 16 °C circa il sudore smette di evaporare bene e la corsa si fa nettamente più dura. È il numero che guardano davvero gli allenatori di endurance.',
      },
      {
        q: 'Quanto dura una “fascia”?',
        a: 'Quanto la tua corsa. Runny moltiplica la distanza del percorso per il tuo passo, arrotonda alle ore piene e mostra solo i tratti in cui tutta la corsa resta buona — non un’ora bella circondata da pioggia.',
      },
      {
        q: 'Da dove arrivano gli anelli consigliati?',
        a: 'Scegli una distanza e Runny piazza dei waypoint su un cerchio attorno alla partenza, calcola un percorso pedonale che li tocca, misura la distanza reale, poi ridimensiona il cerchio e riprova finché l’anello non si avvicina all’obiettivo. Sono tutte strade percorribili vere, da OpenStreetMap.',
      },
      {
        q: 'Perché proprio quelle distanze?',
        a: 'Sono i classici dei blocchi di preparazione a mezza e maratona: 5 e 10 km per ritmo e ripetute, 15 e 21,1 km per i lunghi di una mezza, 30 km come prova generale della maratona e 42,2 km perché qualcuno lo chiede sempre.',
      },
      {
        q: 'La mia posizione viene mandata da qualche parte?',
        a: 'Le coordinate arrivano ai servizi di meteo, routing e geocoding perché possano rispondere: Open-Meteo, il router Valhalla di OpenStreetMap e Photon. Runny non salva nulla, non ci sono account, analytics o tracciamento. Il tuo ultimo percorso resta nel tuo browser.',
      },
      {
        q: 'Funziona offline?',
        a: 'Runny si installa come PWA e tiene in cache l’app e le ultime previsioni, quindi si apre e ti mostra l’ultima risposta anche senza campo. Per percorsi nuovi e previsioni fresche serve la connessione.',
      },
      {
        q: 'Mi devo fidare più di lui o delle mie gambe?',
        a: 'Delle gambe. È una previsione, e le previsioni a volte sbagliano. Runny sceglie le ore, tu decidi se le gambe sono d’accordo.',
      },
    ],
  },

  footer: {
    blurb: 'Le previsioni, lungo il tuo percorso, tradotte in una risposta sola: quando correre per non sciogliersi.',
    sitemap: 'Mappa del sito',
    linkPlan: 'Percorso',
    linkFaq: 'FAQ',
    linkRepo: 'Codice sorgente',
    data: 'Meteo Open-Meteo · routing Valhalla su OpenStreetMap · ricerca Photon · tile CARTO',
    copy: '© 2026 Runny',
    joke: 'Nessuna responsabilità per le sfregature.',
  },

  errors: {
    geoUnsupported: 'Questo browser non ha la geolocalizzazione. Scrivi la partenza a mano.',
    geoDenied: 'Permesso di posizione negato. Scrivi la partenza a mano.',
    geoFailed: 'Non riesco a leggere la tua posizione. Scrivi la partenza a mano.',
    search: 'La ricerca dei luoghi non è disponibile in questo momento.',
    route: 'Non riesco a costruire un percorso tra quei punti. Prova a spostarne uno.',
    routeSame: 'Partenza e arrivo coincidono. Attiva “Arrivo dove sono partito” per un anello.',
    weather: 'Il servizio meteo non è disponibile in questo momento.',
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
    1: 'Poco nuvoloso',
    2: 'Parzialmente nuvoloso',
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
