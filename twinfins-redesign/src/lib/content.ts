/**
 * Copy + structured content for twinfinscoffee.com.
 *
 * Anything factual — the email address, the Instagram handle, the booking
 * agreement, the service names — is preserved verbatim from the original
 * site. Only the framing around it has been rewritten.
 */

export const BRAND = {
  name: "Twin Fins Coffee",
  tagline: "Coffee + Surf",
  est: "2024",
  email: "twinfinscoffee@gmail.com",
  instagram: "twinfinscoffee",
  instagramUrl: "https://instagram.com/twinfinscoffee",
  promise: "Paradise in every sip.",
  /** The three-line positioning Twin Fins uses in its own Instagram bio. */
  positioning: "Mobile coffee bar · Private events · Coffee activations",
  owner: "Natalia Tureta",
  ownerInstagram: "natalia_tureta",
  ownerInstagramUrl: "https://instagram.com/natalia_tureta",
  city: "Atlanta, GA",
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/story" },
  { label: "Book an Event", href: "/booking" },
  { label: "Menu", href: "/menu" },
  { label: "Locations", href: "/locations" },
];

export const TICKER = [
  "Paradise in every sip",
  "Coffee + Surf",
  "Est. 2024",
  "Mobile coffee cart",
  "Pop-ups & private events",
  "We can’t wait to sea you",
];

export const PHILOSOPHY = [
  {
    id: "craft",
    kicker: "01",
    title: "Craft",
    body: "Freshly ground beans and top-tier equipment that brews a bold, flavorful cup every time. No shortcuts, no burnt shots, no matter how long the line gets.",
    image: "/images/espresso-pull.jpg",
    caption: "Every shot pulled to order",
  },
  {
    id: "sustainable",
    kicker: "02",
    title: "Sustainable",
    body: "Eco-friendly products, local suppliers, and a deliberately small footprint. A percentage of every sale goes to charities protecting marine wildlife — the ocean gave us the whole idea, so it gets a cut.",
    image: "/images/turtle.jpg",
    caption: "A cut of every sale protects marine wildlife",
  },
  {
    id: "innovation",
    kicker: "03",
    title: "Innovation",
    body: "We’re always experimenting and pushing what’s possible with coffee and tea. Seasonal syrups, event-only specials, drinks built around your brand. There’s always something new to discover.",
    image: "/images/pour.jpg",
    caption: "Seasonal specials, built in-house",
  },
] as const;

export const SERVICES = [
  {
    id: "cart",
    title: "Coffee Cart",
    lead: "Our mobile coffee bar, wherever you need it.",
    body: "The full Twin Fins setup rolls up to your venue — espresso, cold brew, matcha, and a barista team pouring paradise all day.",
    image: "/images/cart-setup.jpg",
    tags: ["Weddings", "Markets", "Office days"],
  },
  {
    id: "activation",
    title: "Custom Activations",
    lead: "Your brand, poured into every cup.",
    body: "Custom-branded cups, bespoke drink menus, and a cart styled to match your event. We poured trackside in the Champions Club at the Formula 1 Miami Grand Prix — we can handle yours.",
    image: "/images/event-styling.jpg",
    tags: ["Brand launches", "Conferences", "Pop-ups"],
  },
  {
    id: "drybar",
    title: "Dry Bar",
    lead: "You provide the bottles — we provide the service.",
    body: "Elevate your next gathering with a custom mobile bar, staffed and styled by the Twin Fins crew.",
    image: "/images/cart-wedding.jpg",
    tags: ["Private parties", "Receptions", "Celebrations"],
  },
] as const;

/* ------------------------------------------------------------------- menu
   Transcribed from Twin Fins' own menu PDF (public/menu/twin-fins-coffee-menu.pdf).
   Prices, drink names and descriptions are verbatim from that document — the
   only edit is writing the alt-milk and flavour surcharge as "+$0.75" rather
   than the sheet's "+$0.75¢", which mixes dollars and cents.
   ------------------------------------------------------------------------ */

export const MENU_PDF = "/menu/twin-fins-coffee-menu.pdf";

export const MENU = [
  {
    id: "espresso",
    title: "Espresso",
    items: [
      { name: "Americano", price: "$4.50" },
      { name: "Cortado", price: "$4.00" },
      { name: "Cappuccino", price: "$5.00" },
      { name: "Latte", price: "$6.00" },
    ],
  },
  {
    id: "non-coffee",
    title: "Non-coffee",
    items: [
      { name: "Matcha Latte", price: "$6.00" },
      { name: "Chai Latte", price: "$6.00" },
      { name: "Hot Chocolate", price: "$4.00" },
    ],
  },
  {
    id: "specialty",
    title: "Specialty drinks",
    items: [
      {
        name: "Salty Waves Latte",
        price: "$7.00",
        note: "Salted caramel and coconut with caramel drizzle",
      },
      {
        name: "Maui Matcha Latte",
        price: "$7.00",
        note: "Matcha latte with vanilla and lavender",
      },
    ],
  },
] as const;

/** Add-ons, priced the same either way. */
export const MENU_FLAVORS = {
  surcharge: "+$0.75",
  items: [
    "Salted Caramel",
    "Vanilla",
    "Coconut",
    "Lavender",
    "Mocha",
    "White Mocha",
    "SF Vanilla",
    "Simple Syrup",
  ],
} as const;

export const MENU_MILKS = {
  included: ["Whole", "Skim"],
  alt: ["Oat", "Almond"],
  altSurcharge: "+$0.75",
} as const;

export const BOOKING_TERMS = [
  {
    title: "24-hour cancellation",
    body: "All parties must cancel at least 24 hours in advance. Failure to do so will result in a cancellation fee.",
  },
  {
    title: "Book 5 days ahead",
    body: "All bookings must be made at least 5 days prior to the event date.",
  },
  {
    title: "Allergen notice",
    body: "Drinks served may contain dairy, gluten, or nuts. Please disclose any allergies before consuming any beverages.",
  },
  {
    title: "Event details required",
    body: "All parties must provide an address, date, and time as well as a contact number when booking an event.",
  },
  {
    title: "Deposit over 200 guests",
    body: "A $100 deposit is required when booking events over 200 people. The deposit goes toward the cost of the service.",
  },
] as const;

/* ------------------------------------------------------------- served at
   Venues and clients the cart has actually worked. Marks are the property of
   their owners and are shown here as service credits, normalised to a single
   white weight so the band reads as one row rather than six brand systems.
   ------------------------------------------------------------------------ */

export const SERVED_AT = [
  {
    name: "F1 Experiences — Champions Club",
    short: "F1 Experiences",
    logo: "/images/logos/f1-v2.png",
    color: "#e10600",
    note: "Miami Grand Prix paddock",
    width: 600,
    height: 160,
  },
  {
    name: "AmericasMart Atlanta",
    short: "AmericasMart",
    logo: "/images/logos/americasmart-v2.png",
    color: "#ed5360",
    note: "Building 1, downtown",
    width: 600,
    height: 160,
  },
  {
    name: "Scott Antique Markets",
    short: "Scott Antique Markets",
    logo: "/images/logos/scott-antique-markets-v2.png",
    color: "#f7f3e9",
    note: "Atlanta Expo Centers",
    width: 600,
    height: 160,
  },
  {
    name: "Colony Square",
    short: "Colony Square",
    logo: "/images/logos/colony-square-v2.png",
    color: "#f7f3e9",
    note: "Midtown Atlanta",
    width: 600,
    height: 160,
  },
  {
    name: "Serenbe",
    short: "Serenbe",
    logo: "/images/logos/serenbe-v2.png",
    color: "#f7f3e9",
    note: "Chattahoochee Hills",
    width: 600,
    height: 160,
  },
  {
    name: "Atlanta BeltLine",
    short: "Atlanta BeltLine",
    logo: "/images/logos/atlanta-beltline-v2.png",
    color: "#68bb44",
    note: "Eastside Trail pop-ups",
    width: 600,
    height: 160,
  },
  {
    name: "The Bert Show",
    short: "The Bert Show",
    logo: "/images/logos/the-bert-show-v2.png",
    color: "#62b0b9",
    note: "On air, October 2025",
    width: 600,
    height: 160,
  },
] as const;

/* ------------------------------------------------------------------ story
   Sourced from public reporting on Twin Fins and its founder — the April 2024
   GoFundMe, the Atlanta Coffee Shops profile and pop-up listing, and the Zola
   vendor page. Dates, numbers, gear, and quotes are verbatim from those
   sources; the connective prose is brand voice.
   ------------------------------------------------------------------------ */

export const FOUNDER = {
  name: "Natalia Tureta",
  role: "Founder + head barista",
  /** Verbatim, from the April 2024 GoFundMe. */
  quote:
    "I am thankful for any and all support, and am excited to share this journey with everyone.",
};

export const STORY_FACTS = [
  { value: "2024", label: "Founded" },
  { value: "32", label: "First backers" },
  { value: "5.0", label: "Wedding rating" },
  { value: "F1", label: "Miami paddock" },
] as const;

export const STORY_CHAPTERS = [
  {
    id: "before",
    marker: "2023",
    kicker: "Before the cart",
    title: "A production assistant, a strike, and an espresso machine.",
    body: "Natalia was working as a production assistant on Atlanta film sets when the industry went quiet. The strike stopped the calls, so she picked up a job behind a bar and spent months learning the craft — dialing in shots, reading milk, learning what a good morning actually tastes like.",
    icon: "Cup",
    media: [
      {
        src: "/images/film-set-pa.jpg",
        lowRes: true,
        alt: "Natalia on a film set in a face shield and a Yellow Zone crew badge",
      },
    ],
  },
  {
    id: "sets",
    marker: "Then",
    kicker: "The idea",
    title: "On set, everything happens around the coffee.",
    body: "Back on set she noticed the thing every crew member already knows: the coffee truck is where the day starts. It's the huddle, the reset, the five minutes that make the next twelve hours possible. She wanted to build the one people looked forward to.",
    icon: "Sunrise",
    media: [
      {
        src: "/images/film-set-crew.jpg",
        alt: "A working Atlanta film set — crew, monitors, and a camera rig between takes",
        /** Source frame is only 720x960; presented small so it isn't upscaled. */
        lowRes: true,
      },
    ],
  },
  {
    id: "beach",
    marker: "The turn",
    kicker: "Saltwater",
    title: "A trip to the beach gave it a shape.",
    body: "A beach trip supplied the twist. A twin fin is a board built for looseness — less control, more feel, made for cruising a wave rather than conquering it. That became the brief for the whole thing: unhurried, warm, a little sun-bleached, serious only about what's in the cup.",
    icon: "Surfboard",
    media: [
      {
        src: "/images/sip-paradise.jpg",
        lowRes: true,
        alt: "A Twin Fins iced coffee sipped on the beach under the words Sip into Paradise",
      },
    ],
  },
  {
    id: "gofundme",
    marker: "Apr 3, 2024",
    kicker: "Going public",
    title: "Thirty-two people believed in it first.",
    body: "The fundraiser went live on April 3rd, 2024 with a $6,000 goal to build the cart. Thirty-two backers put in $2,275 before it ever poured a shot — friends, crew, strangers. Twin Fins started as a group project.",
    icon: "SandDollar",
  },
  {
    id: "llc",
    marker: "Est. 2024",
    kicker: "Twin Fins Coffee, LLC",
    title: "Wheels on, cart out, first pours.",
    body: "Film sets, private events, farmers markets — wherever a good cup would land best. No storefront, no fixed address, just a cart that shows up and turns a corner of a room into the best part of it.",
    icon: "Palm",
    media: [
      {
        src: "/images/van-sip.jpg",
        alt: "Natalia drinking an iced Twin Fins coffee from the window of a vintage van",
      },
    ],
  },
  {
    id: "bar",
    marker: "The build",
    kicker: "The bar itself",
    title: "A Linea Mini and a Guatemala blend.",
    body: "Espresso runs on a La Marzocco Linea Mini and a rotating pour from Valor Coffee in Alpharetta — usually their Freethrow blend, a Guatemala with milk chocolate, lychee, and brown sugar in it. Oat milk always on hand, matcha whisked to order, cards tapped instead of cash counted.",
    icon: "Coconut",
    media: [
      {
        src: "/images/espresso-pull.jpg",
        alt: "A double espresso pulling into a glass on the cart's La Marzocco",
      },
    ],
  },
  {
    id: "weddings",
    marker: "2025",
    kicker: "Down the aisle",
    title: "Turns out weddings want coffee too.",
    body: "Bar service started showing up at receptions at $6 a head, and the reviews came back five stars across the board — the cart as the late-night second wind, the thing guests circle back to between the toasts and the last song.",
    icon: "Star",
  },
  {
    id: "onair",
    marker: "Oct 8, 2025",
    kicker: "On air",
    title: "Twenty minutes on Atlanta radio.",
    body: "The Bert Show had her in the studio to talk about the cart — headphones on, mic live, an iced latte in hand at an hour most people are still asleep. Her words afterward: an absolute blast.",
    icon: "Sunrise",
    media: [
      {
        src: "/images/bert-show.jpg",
        alt: "Natalia at The Bert Show step-and-repeat in a Twin Fins Surf Club hat, holding an iced coffee and a retro radio",
      },
    ],
  },
  {
    id: "upsidedown",
    marker: "Nov 26, 2025",
    kicker: "The Upside Down",
    title: "An Eggo Latte at the Piggly Wiggly.",
    body: "For the release of Stranger Things season five, Twin Fins built an 80s pop-up at Bradley's Big Buy in Palmetto — eight to two, retro music, photo ops, an Eggo Latte with vanilla, maple and cereal on top, and a Castle Byers Chai with cinnamon, cardamom, and banana milk. Completely fan-made and independent, no Netflix involved. The whole point, in Natalia's words, was to bring together the fan base and community.",
    icon: "Wave",
    media: [
      {
        src: "/images/stranger-flyer.jpg",
        alt: "The pop-up flyer: Bradley's Big Buy and Twin Fins Coffee, November 26, 8am to 2pm, 506 Center St Palmetto GA",
      },
      {
        src: "/images/stranger-dairy.jpg",
        alt: "Natalia in an 80s jacket holding Eggo boxes and a Twin Fins cup in the dairy aisle",
      },
      {
        src: "/images/stranger-cart.jpg",
        alt: "A grocery cart loaded with Eggo boxes and Demogorgon Crunch cereal, Twin Fins cup in hand",
      },
    ],
  },
  {
    id: "f1",
    marker: "May 2026",
    kicker: "Trackside",
    title: "Into the paddock at the Miami Grand Prix.",
    body: "Twin Fins joined the paddock at the Formula 1 Miami Grand Prix, pouring for guests of the Champions Club — the hospitality suite that sits inside the circuit at Turn 5, in the shadow of Hard Rock Stadium. The cart's own announcement put it best: where luxury meets quality. Two years from a $6,000 fundraiser to espresso trackside at a Grand Prix.",
    icon: "Star",
    media: [
      {
        src: "/images/activation-cup.jpg",
        lowRes: true,
        alt: "An iced latte in an F1 Experiences Champions Club cup, held up above the Miami circuit as a car passes",
      },
    ],
  },
  {
    id: "now",
    marker: "Now",
    kicker: "Where we're pouring",
    title: "Still mobile. Still giving a cut back to the ocean.",
    body: "You'll find the cart at America's Mart Building 1, at markets and pop-ups around Atlanta, and anywhere someone books it. A percentage of every sale still goes to charities protecting marine wildlife — the beach gave us the idea, so it gets a share.",
    icon: "Wave",
    media: [
      {
        src: "/images/cart-street.jpg",
        alt: "The Twin Fins cart set up on a shaded street beneath a fringed umbrella, longboard alongside",
      },
      {
        src: "/images/coffee-sign.jpg",
        alt: "A marquee-letter COFFEE sign on the cart's wooden service ledge",
      },
      {
        src: "/images/cup-offered.jpg",
        alt: "A finished iced Twin Fins latte held out across the bar to a customer",
      },
    ],
  },
] as const;

export const CRAFT_SPECS = [
  {
    id: "espresso",
    label: "Espresso",
    value: "La Marzocco Linea Mini",
    note: "The same machine serious cafés build a bar around, packed onto a cart.",
  },
  {
    id: "beans",
    label: "Beans",
    value: "Valor Coffee — Freethrow",
    note: "Roasted in Alpharetta, GA. A Guatemala blend: milk chocolate, lychee, brown sugar.",
  },
  {
    id: "milk",
    label: "Milk",
    value: "Whole, skim, oat, almond",
    note: "Four milks on the cart at every event. Alt milks are +$0.75, same as a flavour shot.",
  },
  {
    id: "matcha",
    label: "Matcha",
    value: "Whisked to order",
    note: "Ceremonial-style, sifted and whisked at the bar rather than pumped from a bottle.",
  },
  {
    id: "payment",
    label: "Payment",
    value: "Tap, chip, or host-covered",
    note: "Debit and credit at pop-ups; hosts can pre-buy the whole bar for private events.",
  },
  {
    id: "giveback",
    label: "Give-back",
    value: "Marine wildlife charities",
    note: "A percentage of every sale, every event, since the first day of service.",
  },
] as const;

/** Verbatim from the cart's Google listing — 5.0 across 16 reviews. */
export const GOOGLE_RATING = {
  score: "5.0",
  count: 16,
  href: "https://share.google/M9yFA6Yfy4FdbieQq",
} as const;

export const PRAISE = [
  {
    quote:
      "Twin Fins made a wonderful contribution to the wedding event by providing a fun and relaxed coffee service to guests! Natalia was professional and super easy to communicate with!",
    author: "Christy F.",
    context: "Wedding, May 2025",
    source: "Zola",
  },
  {
    quote:
      "Twin Fins Coffee's bar services at our wedding were simply sunny with great taste. Their communication throughout the planning process was top-notch, and their setup on the day was really on point.",
    author: "Daniel T.",
    context: "Wedding, May 2025",
    source: "Zola",
  },
  {
    quote:
      "They were friendly and welcoming, and so sweet to my dog too, and even offered him a pup cup. And I can't forget to mention that the coffee was sooo delicious!",
    author: "Jena",
    context: "Oddities & Curiosities Expo, Atlanta",
    source: "Google",
  },
  {
    quote:
      "Such a cute coffee spot! We tried the fall menu — the apple latte and the pumpkin latte were both yummy!",
    author: "Lyndsey B.",
    context: "Fall menu",
    source: "Google",
  },
  {
    quote:
      "Such great coffee with the sweetest employees. Also their branding is so cute!",
    author: "Megan L.",
    context: "At the cart",
    source: "Google",
  },
  {
    quote:
      "The Salty Waves is one of their signature drinks and it is so delicious!",
    author: "Google reviewer",
    context: "Signature menu",
    source: "Google",
  },
  {
    quote: "Best latte art I've ever put my lips on.",
    author: "Christopher B.",
    context: "At the cart",
    source: "At the cart",
  },
] as const;

/** Regular haunts, from the cart's own event posts. */
export const FIND_US = [
  { label: "Atlanta BeltLine", note: "Beach-party pop-ups on the Eastside Trail" },
  { label: "Hipop Markets", note: "Atlanta's roving maker markets" },
  { label: "AmericasMart", note: "Building 1, downtown Atlanta" },
  { label: "Your place", note: "Weddings, offices, launches — anywhere it books" },
] as const;

export const PRESS = [
  {
    outlet: "Atlanta Coffee Shops",
    line: "Profiled the cart, the Valor Freethrow pour, and where to catch a pop-up.",
    href: "https://www.atlantacoffeeshops.com/twin-fins-coffee",
  },
  {
    outlet: "Atlanta Coffee Shops — Events",
    line: "Listed the fan-made Stranger Things season five pop-up in Palmetto.",
    href: "https://www.atlantacoffeeshops.com/events/stranger-things-coffee-pop-up-with-twin-fins-coffee",
  },
  {
    outlet: "Zola",
    line: "5.0 out of 5 from couples who booked the bar for their wedding day.",
    href: "https://www.zola.com/wedding-vendors/wedding-bar-services/twin-fins-coffee",
  },
  {
    outlet: "GoFundMe",
    line: "The original April 2024 campaign that got the cart built.",
    href: "https://www.gofundme.com/f/twin-fins-coffee-cart",
  },
] as const;

export const GALLERY = [
  {
    src: "/images/cart-logo.jpg",
    alt: "The Twin Fins Coffee cart, its teal logo panel trimmed with fresh flowers",
    span: "tall",
    pos: "65% center",
  },
  {
    src: "/images/cart-pergola.jpg",
    alt: "The full Twin Fins pop-up under a pergola — cart, surfboard menu, and a thatched merch stand",
    span: "wide",
  },
  {
    src: "/images/espresso-pull.jpg",
    alt: "A double espresso pulling into a glass on the cart's machine",
    span: "tall",
    pos: "center 62%",
  },
  {
    src: "/images/cup-held.jpg",
    alt: "A guest holding up an iced latte in a branded Twin Fins cup",
    span: "tall",
  },
  {
    src: "/images/cart-street.jpg",
    alt: "The Twin Fins cart on a shaded street with a longboard and fringed umbrella",
    span: "tall",
  },
  {
    src: "/images/menu-board.jpg",
    alt: "A surfboard hand-painted with the Twin Fins summer menu",
    span: "tall",
  },
  {
    src: "/images/customers.jpg",
    alt: "Two guests laughing with iced coffees at a Twin Fins pop-up",
    span: "tall",
    pos: "center 30%",
  },
  {
    src: "/images/event-styling.jpg",
    alt: "A beach-club photo moment styled by Twin Fins — fringed umbrella, tropical florals, and a mirror",
    span: "wide",
  },
  {
    src: "/images/cart-wedding.jpg",
    alt: "The dry bar service styled for a wedding — monogrammed cart, white florals, and iced bottles",
    span: "tall",
  },
  {
    src: "/images/cup-greenery.jpg",
    alt: "An iced Twin Fins latte resting on a wooden tray with tropical leaves",
    span: "tall",
  },
  {
    src: "/images/barista.jpg",
    alt: "A Twin Fins barista in sunglasses working the cart on a bright summer day",
    span: "tall",
    pos: "center 30%",
  },
  {
    src: "/images/lineup.jpg",
    alt: "Surfers waiting in the lineup, seen from above on glassy green water",
    span: "tall",
  },
  {
    src: "/images/pour-cup.jpg",
    alt: "An iced mocha mid-pour, chocolate laced down the cup",
    span: "tall",
  },
  {
    src: "/images/activation-cup.jpg",
    alt: "A co-branded Champions Club cup held up trackside at an event activation",
    span: "tall",
  },
  {
    src: "/images/cup-branded.jpg",
    alt: "An iced latte in the Twin Fins palm-badge cup, terracotta rooftops behind",
    span: "tall",
  },
  {
    src: "/images/hat-beach.jpg",
    alt: "A Twin Fins Surf Club trucker hat, worn beachcombing at the waterline",
    span: "tall",
    pos: "center 35%",
  },
] as const;
