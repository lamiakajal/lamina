export type Species = { name: string; note: string };

export type Zone = {
  id: string;
  name: string; // everyday name
  technical: string; // scientific name of the layer
  from: number; // metres
  to: number;
  title: string;
  body: string;
  light: string;
  pressure: string;
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
    body: "Sunlight reaches every corner here, and almost everything the ocean eats starts as light: tiny drifting plants called phytoplankton turn it into food. Out in open water there is nowhere to hide, so fish move in tight schools. Safety comes in numbers.",
    light: "Full sun, fading to about 1%",
    pressure: "1 to 21 atm",
    species: [
      { name: "Sardines", note: "Schools can hold thousands of fish moving as one." },
      { name: "Giant manta ray", note: "Wingspan can reach about 7 metres." },
    ],
  },
  {
    id: "twilight",
    name: "Twilight zone",
    technical: "Mesopelagic",
    from: 200,
    to: 1000,
    title: "The last blue",
    body: "Only a faint blue glow survives. Many animals here have mirrored sides and make their own light to hide their silhouettes from hunters below. Every night, millions of them rise toward the surface to feed and sink again at dawn, one of the largest migrations on Earth.",
    light: "A faint blue glow",
    pressure: "21 to 101 atm",
    species: [
      { name: "Bluefin tuna", note: "Can keep their bodies warmer than the water around them." },
      { name: "Lanternfish", note: "Among the most abundant fish on the planet." },
    ],
  },
  {
    id: "midnight",
    name: "Midnight zone",
    technical: "Bathypelagic",
    from: 1000,
    to: 4000,
    title: "No sunlight at all",
    body: "Below 1,000 metres the sun never reaches. The water hovers around 4 °C and the only light is living light, called bioluminescence. Jellies pulse softly, and anglerfish dangle a lure that glows thanks to bacteria living inside it.",
    light: "None. Only bioluminescence",
    pressure: "101 to 401 atm",
    species: [
      { name: "Deep-sea jellyfish", note: "Many make their own light." },
      { name: "Anglerfish", note: "The glowing lure draws prey toward the mouth." },
    ],
  },
  {
    id: "abyss",
    name: "The abyss",
    technical: "Abyssopelagic",
    from: 4000,
    to: 6000,
    title: "The long dark",
    body: "Food is scarce, so life here is slow and efficient. Most of it arrives as marine snow, a steady drift of dead plankton and debris from far above. Gulper eels, with huge hinged mouths and whip-like tails tipped with a faint light, wait for whatever comes by.",
    light: "None",
    pressure: "401 to 601 atm",
    species: [
      { name: "Gulper eel", note: "A huge, loose mouth lets it swallow prey nearly its own size." },
      { name: "Vampire squid", note: "Spreads its webbed arms like a cloak when threatened." },
    ],
  },
  {
    id: "hadal",
    name: "Hadal zone",
    technical: "Hadopelagic",
    from: 6000,
    to: 11000,
    title: "The bottom of the world",
    body: "These depths are mostly ocean trenches. The deepest point, Challenger Deep, lies near 10,935 metres, where the pressure tops 1,000 atmospheres. Even here there is life: snailfish have been filmed beyond 8,000 metres, deeper than any other known fish.",
    light: "None",
    pressure: "601 to 1,100 atm",
    species: [
      { name: "Snailfish", note: "The deepest fish ever recorded, soft-bodied and pale." },
      { name: "Amphipods", note: "Tiny crustaceans that scavenge the trench floor." },
    ],
  },
];

export const ZONE_COUNT = ZONES.length;
