export type Species = {
  name: string;
  latin: string;
  note: string;
  file?: string; // matches a photo in public/creatures, if one has been added
};

export type Zone = {
  id: string;
  name: string; // everyday name
  technical: string; // scientific name of the layer
  from: number; // metres
  to: number;
  title: string;
  kicker: string; // one line under the title
  body: string;
  light: string;
  pressure: string;
  temperature: string;
  fact: string;
  species: Species[];
};

export const ZONES: Zone[] = [
  {
    id: "sunlight",
    name: "Sunlight zone",
    technical: "Epipelagic",
    from: 0,
    to: 200,
    title: "Where the light lives",
    kicker: "Everything the ocean eats starts here.",
    body: "Sunlight reaches every corner of this layer, and almost all marine life depends on it. Tiny drifting plants called phytoplankton turn light into food, and the whole ocean feeds on them, one bite at a time. In open water there is nowhere to hide, so fish move in tight schools. Safety comes in numbers.",
    light: "Full sun, fading to about 1%",
    pressure: "1 to 21 atm",
    temperature: "Warm, up to about 30 °C",
    fact: "Tiny plankton in this layer produce about half of the oxygen in our atmosphere.",
    species: [
      { name: "Sardines", latin: "Sardina pilchardus", note: "Schools can hold thousands of fish moving as one.", file: "sardine" },
      { name: "Yellowtail snapper", latin: "Ocyurus chrysurus", note: "Hunts in loose schools above reefs and open sand.", file: "yellow-snapper" },
      { name: "Giant manta ray", latin: "Mobula birostris", note: "Wingspan can reach about 7 metres.", file: "manta-ray" },
      { name: "Mahi-mahi", latin: "Coryphaena hippurus", note: "Fast, colourful hunters that follow floating weed and debris.", file: "mahi-mahi" },
      { name: "Great hammerhead", latin: "Sphyrna mokarran", note: "The wide head carries sensors that pick up faint electric fields.", file: "hammerhead-shark" },
      { name: "Green sea turtle", latin: "Chelonia mydas", note: "Grazes on seagrass and can rest underwater for hours.", file: "sea-turtle" },
      { name: "Whale shark", latin: "Rhincodon typus", note: "The largest fish alive, and it feeds on plankton.", file: "whale-shark" },
    ],
  },
  {
    id: "twilight",
    name: "Twilight zone",
    technical: "Mesopelagic",
    from: 200,
    to: 1000,
    title: "The last blue",
    kicker: "A glow so faint your eyes would barely notice it.",
    body: "Only a faint blue glow survives. Many animals here have mirrored sides, and some make their own light to hide their silhouettes from hunters below. Every night, millions of them rise toward the surface to feed and sink again at dawn, one of the largest migrations on Earth.",
    light: "A faint blue glow",
    pressure: "21 to 101 atm",
    temperature: "Falling from about 20 °C to 4 °C",
    fact: "The nightly rise of animals from this layer is the largest animal migration on Earth, measured by weight.",
    species: [
      { name: "Bluefin tuna", latin: "Thunnus thynnus", note: "Can keep their bodies warmer than the water around them.", file: "bluefin-tuna" },
      { name: "Lanternfish", latin: "Myctophidae", note: "Among the most abundant fish on the planet.", file: "lanternfish" },
      { name: "Swordfish", latin: "Xiphias gladius", note: "Uses its bill to slash through schools of prey.", file: "swordfish" },
      { name: "Ocean sunfish", latin: "Mola mola", note: "Dives hundreds of metres to feed on jellyfish.", file: "sunfish" },
      { name: "Hatchetfish", latin: "Argyropelecus", note: "Glows from underneath to cancel out its own shadow.", file: "hatchetfish" },
      { name: "Oarfish", latin: "Regalecus glesne", note: "The longest bony fish, sometimes over 8 metres.", file: "oarfish" },
    ],
  },
  {
    id: "midnight",
    name: "Midnight zone",
    technical: "Bathypelagic",
    from: 1000,
    to: 4000,
    title: "No sunlight at all",
    kicker: "The only light is living light.",
    body: "Below 1,000 metres the sun never reaches. The water hovers around 4 °C, and the only light comes from animals themselves, a glow called bioluminescence. Jellies pulse softly in the dark, and anglerfish dangle a lure that shines thanks to bacteria living inside it.",
    light: "None. Only bioluminescence",
    pressure: "101 to 401 atm",
    temperature: "About 4 °C",
    fact: "In one long study off California, about three quarters of the animals seen in open water made their own light.",
    species: [
      { name: "Atolla jellyfish", latin: "Atolla wyvillei", note: "When attacked it flashes a ring of blue light as an alarm.", file: "atolla-jelly" },
      { name: "Mauve stinger", latin: "Pelagia noctiluca", note: "A drifting jelly that glows when disturbed.", file: "pelagia-jelly" },
      { name: "Anglerfish", latin: "Melanocetus johnsonii", note: "The glowing lure draws prey toward the mouth.", file: "anglerfish" },
      { name: "Viperfish", latin: "Chauliodus", note: "Its teeth are so long they do not fit inside the closed mouth.", file: "viperfish" },
      { name: "Fangtooth", latin: "Anoplogaster cornuta", note: "Teeth that look far too big for its small body.", file: "fangtooth" },
      { name: "Giant squid", latin: "Architeuthis dux", note: "Its eyes can be as wide as a dinner plate.", file: "giant-squid" },
    ],
  },
  {
    id: "abyss",
    name: "The abyss",
    technical: "Abyssopelagic",
    from: 4000,
    to: 6000,
    title: "The long dark",
    kicker: "Slow, cold, and patient.",
    body: "Food is scarce, so life here is slow and efficient. Most of it arrives as marine snow, a steady drift of dead plankton and debris from far above. Gulper eels, with huge hinged mouths and whip-like tails tipped with a faint light, wait for whatever comes by.",
    light: "None",
    pressure: "401 to 601 atm",
    temperature: "About 2 °C",
    fact: "Marine snow can take weeks to sink from the surface to this depth.",
    species: [
      { name: "Gulper eel", latin: "Eurypharynx pelecanoides", note: "A huge, loose mouth lets it swallow prey nearly its own size.", file: "gulper-eel" },
      { name: "Vampire squid", latin: "Vampyroteuthis infernalis", note: "Spreads its webbed arms like a cloak when threatened.", file: "vampire-squid" },
      { name: "Dumbo octopus", latin: "Grimpoteuthis", note: "Flaps ear-like fins to hover just above the seafloor.", file: "dumbo-octopus" },
      { name: "Abyssal grenadier", latin: "Coryphaenoides armatus", note: "A common scavenger on the deep plains.", file: "grenadier" },
    ],
  },
  {
    id: "hadal",
    name: "Hadal zone",
    technical: "Hadopelagic",
    from: 6000,
    to: 11000,
    title: "The bottom of the world",
    kicker: "Even here, something is alive.",
    body: "These depths are mostly ocean trenches. The deepest point, Challenger Deep, lies near 10,935 metres, where the pressure tops 1,000 atmospheres. Even here there is life: snailfish have been filmed beyond 8,000 metres, deeper than any other known fish.",
    light: "None",
    pressure: "601 to 1,100 atm",
    temperature: "1 to 4 °C",
    fact: "That is more than 1,000 times the pressure at the surface, and animals still live in it.",
    species: [
      { name: "Hadal snailfish", latin: "Pseudoliparis swirei", note: "The deepest fish ever recorded, soft-bodied and pale.", file: "snailfish" },
      { name: "Giant amphipod", latin: "Hirondellea gigas", note: "Tiny crustaceans that scavenge the trench floor.", file: "amphipod" },
    ],
  },
];

export const ZONE_COUNT = ZONES.length;
