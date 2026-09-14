import type { Lang } from './types'

/* ============================================================
   Runny — copy.
   `en` is the source of truth; `it` is typed against it, so a
   missing or stray key is a compile error rather than a blank UI.
   ============================================================ */

const en = {
  langName: 'English',
  brandTag: 'find your hour',

  nav: {
    plan: 'Planner',
    faq: 'Method',
    backToPlanner: 'Back to the planner',
  },

  hero: {
    kicker: 'Run planner',
    titleA: 'Every run has',
    titleB: 'a right hour.',
    lead: 'Runny reads the air over the exact line you intend to run — every kilometre of it, hour by hour — and marks the windows worth lacing up for.',
    cta: 'Build my run',
    ghost: 'See the method',
    statA: 'Hours read ahead',
    statAValue: '96',
    statB: 'Points sampled per route',
    statBValue: '8',
    statC: 'Accounts needed',
    statCValue: '0',
  },

  planner: {
    kicker: '01 — Route',
    title: 'Where you are going',
    startLabel: 'Start',
    startPlaceholder: 'Street, park, square…',
    endLabel: 'Finish',
    endPlaceholder: 'Street, park, square…',
    loopToggle: 'Finish where I start',
    loopHint: 'Runny closes the line back to your start.',
    useGps: 'Locate me',
    locating: 'Locating',
    swap: 'Reverse',
    clear: 'Clear',
    paceLabel: 'Pace',
    paceUnit: 'min/km',
    paceHint: 'Sets how long the good air has to last.',
    submit: 'Read the air',
    submitting: 'Reading the air',
    noResults: 'Nothing found. Try another spelling.',
    searching: 'Searching',
    yourLocation: 'Here',
  },

  suggest: {
    kicker: '02 — Distance',
    title: 'Or name a distance',
    lead: 'Say how far you want to go and Runny draws three lines that fit it, each heading a different way out of your start.',
    needStart: 'Set a start above, then pick a distance.',
    building: 'Drawing lines',
    failed: 'No line of that length fits around here. Try another start or another distance.',
    pick: 'Take this line',
    loopName: {
      n: 'North',
      ne: 'North-east',
      e: 'East',
      se: 'South-east',
      s: 'South',
      sw: 'South-west',
      w: 'West',
      nw: 'North-west',
    },
    targetNote: 'asked for',
  },

  route: {
    kicker: '03 — Line',
    title: 'The line',
    distance: 'Distance',
    duration: 'Time',
    ascent: 'Climb',
    samples: 'Read at',
    samplesUnit: 'points',
    samplesHint: 'The air is read at these points and averaged across them.',
    legendStart: 'Start',
    legendEnd: 'Finish',
    mapAria: 'Map of the planned running line',
    attribution: '© OpenStreetMap contributors',
  },

  windows: {
    kicker: '04 — Windows',
    title: 'When to go',
    lead: 'Stretches long enough to hold the whole run, ranked by how little the air will cost you.',
    windowLength: 'Window',
    best: 'Go here',
    alternatives: 'Also good',
    perDay: 'Pick of each day',
    none: 'Nothing kind in the next few days. Go early, go slow, carry water.',
    nightToggle: 'Allow night hours',
    nightHint: 'Otherwise 05:00 to 22:00.',
    scoreLabel: 'Index',
    scoreAria: 'Runny index for this window',
    today: 'Today',
    tomorrow: 'Tomorrow',
    feelsLike: 'Feels',
    rainChance: 'Rain',
    windLabel: 'Wind',
    uvLabel: 'UV',
    humidityLabel: 'Humidity',
    hourly: 'Hour by hour',
    hourlyAria: 'Hourly Runny index along the line',
    now: 'Now',
    legend: 'Index scale',
  },

  bands: {
    perfect: 'Prime',
    great: 'Strong',
    ok: 'Workable',
    poor: 'Rough',
    bad: 'Stay in',
  },

  verdicts: {
    perfect: 'Cold, clean air. This is the one.',
    great: 'The weather stays out of your way.',
    ok: 'You will finish it, but you will work for it.',
    poor: 'Cut the distance or move the hour.',
    bad: 'Nothing to gain out there. Wait it out.',
  },

  faq: {
    kicker: 'Method',
    title: 'How the hours are chosen',
    lead: 'The reasoning behind every number on this page.',
    outro: 'Runny plans the hour. The legs are still your department.',
    items: [
      {
        q: 'Why read the whole line instead of one spot?',
        a: 'A long run leaves the neighbourhood. It climbs, it crosses water, it swaps shade for open road. The air at the far end is not the air at your door, so Runny reads several points spread along the line and averages them. What you get back describes the run you are about to do, not the roof you are standing under.',
      },
      {
        q: 'What is the index?',
        a: 'One number from 0 to 100 for each hour, answering a single question: how much will the air cost you. High means the weather is on your side. Low means the same session will hurt more, take longer, or leave you flat the next day.',
      },
      {
        q: 'What moves it most?',
        a: 'Heat, and not the number on the thermometer. Runny works from how hot the air feels once sun and wind are counted, paired with how saturated it is. Those two set the ceiling. Rain, wind and sun exposure can only pull the number down from there — none of them ever make a hard run easy.',
      },
      {
        q: 'Why does a mild day sometimes score badly?',
        a: 'Because the air is full. When moisture is high, sweat stops evaporating and your body loses its cooling system, so 20 degrees can punish you harder than a dry 26. That is the single most underrated thing in endurance running, and it is why two days at the same temperature can score twenty points apart.',
      },
      {
        q: 'How long is a window?',
        a: 'Exactly as long as your run. Runny takes the distance of your line, applies the pace you set, rounds up to whole hours and then only shows stretches where every one of those hours holds. A brilliant hour with a storm behind it is not a window.',
      },
      {
        q: 'Where do the suggested lines come from?',
        a: 'Name a distance and Runny sets out points in a ring around your start, threads a running line through them, measures what it actually got, then tightens or widens the ring and goes again until the length lands where you asked. Three lines are drawn in different directions so the choice is real. Every metre follows ways you can genuinely run.',
      },
      {
        q: 'Why these distances?',
        a: 'They are the sessions a half or full marathon block is actually built from. Five and ten for speed, fifteen and twenty-one for the long work of a half, thirty for the rehearsal every marathon runner dreads, forty-two because the question always comes up.',
      },
      {
        q: 'How accurate is any of this?',
        a: 'It is a forecast. Tomorrow morning is close to certain, the day after is good, four days out is a direction rather than a promise. Check again the night before a session that matters.',
      },
      {
        q: 'What happens to my location?',
        a: 'It is used to answer your question and nothing else. There is no account, no profile, no analytics, no advertising. The last route you planned stays on your own device, and you can clear it by clearing the site data.',
      },
      {
        q: 'Can I keep it on my phone?',
        a: 'Yes. Add it to your home screen and it opens like any other app, full screen and offline, still showing the last answer it gave you. A new plan needs a connection; reading the old one does not.',
      },
    ],
  },

  footer: {
    blurb: 'The air over your route, hour by hour, reduced to one decision: go now, or go later.',
    sitemap: 'Pages',
    linkPlan: 'Planner',
    linkFaq: 'Method',
    copy: '© 2026 Runny',
    made: 'Built for people who would rather not melt.',
  },

  errors: {
    geoUnsupported: 'This browser will not share a location. Type your start instead.',
    geoDenied: 'Location permission refused. Type your start instead.',
    geoFailed: 'Could not place you. Type your start instead.',
    search: 'Place search is down. Try again in a moment.',
    route: 'No running line fits between those two points. Move one of them.',
    routeSame: 'Start and finish are the same point. Switch on "Finish where I start".',
    weather: 'The forecast is out of reach right now.',
    generic: 'Something broke.',
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
  brandTag: 'trova la tua ora',

  nav: {
    plan: 'Pianifica',
    faq: 'Metodo',
    backToPlanner: 'Torna a pianificare',
  },

  hero: {
    kicker: 'Pianificatore di corse',
    titleA: 'Ogni corsa ha',
    titleB: 'la sua ora.',
    lead: 'Runny legge l’aria sulla riga esatta che vuoi correre — chilometro per chilometro, ora per ora — e segna le finestre per cui vale la pena allacciare le scarpe.',
    cta: 'Costruisci la corsa',
    ghost: 'Guarda il metodo',
    statA: 'Ore lette in avanti',
    statAValue: '96',
    statB: 'Punti letti sul percorso',
    statBValue: '8',
    statC: 'Account da creare',
    statCValue: '0',
  },

  planner: {
    kicker: '01 — Percorso',
    title: 'Dove stai andando',
    startLabel: 'Partenza',
    startPlaceholder: 'Via, parco, piazza…',
    endLabel: 'Arrivo',
    endPlaceholder: 'Via, parco, piazza…',
    loopToggle: 'Arrivo dove parto',
    loopHint: 'Runny chiude la riga sul punto di partenza.',
    useGps: 'Localizzami',
    locating: 'Ti localizzo',
    swap: 'Inverti',
    clear: 'Cancella',
    paceLabel: 'Passo',
    paceUnit: 'min/km',
    paceHint: 'Decide quanto deve durare l’aria buona.',
    submit: 'Leggi l’aria',
    submitting: 'Leggo l’aria',
    noResults: 'Niente trovato. Prova a scriverlo diversamente.',
    searching: 'Cerco',
    yourLocation: 'Qui',
  },

  suggest: {
    kicker: '02 — Distanza',
    title: 'O dimmi una distanza',
    lead: 'Dì quanto vuoi fare e Runny traccia tre righe che ci stanno, ognuna che esce dalla tua partenza in una direzione diversa.',
    needStart: 'Metti una partenza qui sopra, poi scegli la distanza.',
    building: 'Traccio le righe',
    failed: 'Nessuna riga di quella lunghezza sta qui intorno. Prova un’altra partenza o un’altra distanza.',
    pick: 'Prendi questa riga',
    loopName: {
      n: 'Nord',
      ne: 'Nord-est',
      e: 'Est',
      se: 'Sud-est',
      s: 'Sud',
      sw: 'Sud-ovest',
      w: 'Ovest',
      nw: 'Nord-ovest',
    },
    targetNote: 'chiesti',
  },

  route: {
    kicker: '03 — Tracciato',
    title: 'Il tracciato',
    distance: 'Distanza',
    duration: 'Tempo',
    ascent: 'Dislivello',
    samples: 'Letto in',
    samplesUnit: 'punti',
    samplesHint: 'L’aria viene letta in questi punti e mediata su tutti.',
    legendStart: 'Partenza',
    legendEnd: 'Arrivo',
    mapAria: 'Mappa del tracciato di corsa',
    attribution: '© contributori OpenStreetMap',
  },

  windows: {
    kicker: '04 — Finestre',
    title: 'Quando uscire',
    lead: 'Tratti lunghi abbastanza da contenere tutta la corsa, ordinati per quanto poco ti costerà l’aria.',
    windowLength: 'Finestra',
    best: 'Vai qui',
    alternatives: 'Vanno bene anche',
    perDay: 'La scelta di ogni giorno',
    none: 'Niente di gentile nei prossimi giorni. Esci presto, vai piano, porta acqua.',
    nightToggle: 'Ammetti le ore notturne',
    nightHint: 'Altrimenti dalle 05:00 alle 22:00.',
    scoreLabel: 'Indice',
    scoreAria: 'Indice Runny di questa finestra',
    today: 'Oggi',
    tomorrow: 'Domani',
    feelsLike: 'Percepita',
    rainChance: 'Pioggia',
    windLabel: 'Vento',
    uvLabel: 'UV',
    humidityLabel: 'Umidità',
    hourly: 'Ora per ora',
    hourlyAria: 'Indice Runny orario lungo il tracciato',
    now: 'Ora',
    legend: 'Scala dell’indice',
  },

  bands: {
    perfect: 'Ideale',
    great: 'Buona',
    ok: 'Fattibile',
    poor: 'Dura',
    bad: 'Resta dentro',
  },

  verdicts: {
    perfect: 'Aria fredda e pulita. È questa.',
    great: 'Il meteo ti lascia in pace.',
    ok: 'La finisci, ma te la fai sentire.',
    poor: 'Taglia la distanza o sposta l’ora.',
    bad: 'Là fuori non guadagni niente. Aspetta.',
  },

  faq: {
    kicker: 'Metodo',
    title: 'Come vengono scelte le ore',
    lead: 'Il ragionamento dietro ogni numero di questa pagina.',
    outro: 'Runny sceglie l’ora. Le gambe restano un problema tuo.',
    items: [
      {
        q: 'Perché leggere tutta la riga e non un punto solo?',
        a: 'Un lungo esce dal quartiere. Sale, attraversa l’acqua, cambia l’ombra con l’asfalto aperto. L’aria all’altro capo non è l’aria sotto casa tua, così Runny legge più punti distribuiti lungo la riga e li media. Quello che torna descrive la corsa che stai per fare, non il tetto sotto cui sei in piedi.',
      },
      {
        q: 'Che cos’è l’indice?',
        a: 'Un numero da 0 a 100 per ogni ora, che risponde a una domanda sola: quanto ti costerà l’aria. Alto vuol dire che il meteo è dalla tua parte. Basso vuol dire che la stessa seduta farà più male, durerà di più o ti lascerà svuotato il giorno dopo.',
      },
      {
        q: 'Che cosa lo muove di più?',
        a: 'Il caldo, e non quello scritto sul termometro. Runny parte da quanto l’aria è calda una volta contati sole e vento, insieme a quanto è satura. Quei due fissano il tetto. Pioggia, vento e sole possono solo tirare il numero più in basso: nessuno di loro rende facile una corsa difficile.',
      },
      {
        q: 'Perché una giornata mite a volte va male?',
        a: 'Perché l’aria è piena. Quando l’umidità è alta il sudore smette di evaporare e il corpo perde il suo sistema di raffreddamento, così 20 gradi ti puniscono più di 26 asciutti. È la cosa più sottovalutata nella corsa di resistenza, ed è il motivo per cui due giornate alla stessa temperatura possono distare venti punti.',
      },
      {
        q: 'Quanto dura una finestra?',
        a: 'Esattamente quanto la tua corsa. Runny prende la lunghezza della riga, applica il passo che hai impostato, arrotonda alle ore piene e poi mostra solo i tratti in cui tutte quelle ore reggono. Un’ora splendida con un temporale dietro non è una finestra.',
      },
      {
        q: 'Da dove arrivano le righe consigliate?',
        a: 'Dici una distanza e Runny dispone dei punti in un anello attorno alla partenza, ci infila dentro una riga corribile, misura quello che è venuto fuori, poi stringe o allarga l’anello e riprova finché la lunghezza non cade dove l’hai chiesta. Le righe tracciate sono tre, in direzioni diverse, così la scelta è vera. Ogni metro segue strade che si possono davvero correre.',
      },
      {
        q: 'Perché proprio queste distanze?',
        a: 'Sono le sedute con cui si costruisce davvero una mezza o una maratona. Cinque e dieci per la velocità, quindici e ventuno per il lavoro lungo di una mezza, trenta per la prova generale che ogni maratoneta teme, quarantadue perché la domanda arriva sempre.',
      },
      {
        q: 'Quanto è preciso tutto questo?',
        a: 'È una previsione. Domani mattina è quasi certa, dopodomani è buona, a quattro giorni è una direzione più che una promessa. Ricontrolla la sera prima di una seduta che conta.',
      },
      {
        q: 'Che fine fa la mia posizione?',
        a: 'Serve a rispondere alla tua domanda e a nient’altro. Non c’è account, non c’è profilo, non ci sono analytics né pubblicità. L’ultimo percorso che hai pianificato resta sul tuo dispositivo e sparisce se cancelli i dati del sito.',
      },
      {
        q: 'Posso tenerlo sul telefono?',
        a: 'Sì. Aggiungilo alla schermata home e si apre come qualsiasi altra app, a tutto schermo e anche senza rete, mostrando l’ultima risposta che ti ha dato. Per un piano nuovo serve la connessione, per rileggere il vecchio no.',
      },
    ],
  },

  footer: {
    blurb: 'L’aria sopra il tuo percorso, ora per ora, ridotta a una decisione sola: esco adesso o esco dopo.',
    sitemap: 'Pagine',
    linkPlan: 'Pianifica',
    linkFaq: 'Metodo',
    copy: '© 2026 Runny',
    made: 'Fatto per chi preferirebbe non sciogliersi.',
  },

  errors: {
    geoUnsupported: 'Questo browser non condivide la posizione. Scrivi la partenza a mano.',
    geoDenied: 'Permesso di posizione negato. Scrivi la partenza a mano.',
    geoFailed: 'Non riesco a localizzarti. Scrivi la partenza a mano.',
    search: 'La ricerca dei luoghi non risponde. Riprova tra un momento.',
    route: 'Non esiste una riga corribile fra quei due punti. Spostane uno.',
    routeSame: 'Partenza e arrivo sono lo stesso punto. Attiva “Arrivo dove parto”.',
    weather: 'Le previsioni non sono raggiungibili in questo momento.',
    generic: 'Qualcosa si è rotto.',
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
    96: 'Temporale, grandine',
    99: 'Temporale, grandine',
  },
}

export const DICTS: Record<Lang, Dict> = { en, it }

export type Strings = Dict

export function t(lang: Lang): Dict {
  return DICTS[lang]
}

export const DATE_LOCALE: Record<Lang, string> = { en: 'en-GB', it: 'it-IT' }
