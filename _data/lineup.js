const names = ["flyman347",
    "P3RC!",
    "rhx34",
    "a positive organ company",
    "Renii.Star",
    "a.pathrose",
    "dynastic",
    "Karman",
    "savoa",
    "Whitefish",
    "Ojela",
    "incarnate",
    "Voidsong",
    "MOOF <333",
    "curro's cube",
    "illusorily",
    "pacificship",
    "Stational",
    "haven",
    "DJ GATOR AIDS",
    "KittyPuppy b2b nevermindful",
    "sapphire brew",
    "gndrfvk",
    "Chanpaiix",
    "irselr",
    "Laura97",
    "tallgrll",
    "lumaline",
    "Bonbon",
    "SÍODA",
    "PegasYs",
    "Another Love",
    "arkyalina",
    "PLUSTWENTYFOUR",
    "Coffiton",
    "nyla♡",
    "DARYA PLUR",
    "kryptid",
    "littleflodus",
    "fuck",
    "Learke",
    "KYTH3",
    "Teetow",
    "PANDAMONEYUM",
    "wormhole!!",
    "hyperlnxx",
    "Trash Panda QC",
    "in barbados eatin sushi like im kung f",
    "habiboi",
    "heydron",
    "DJ NRA",
    "The Dimmest Bulb",
    "YARHGANG",
    "Jem",
    "scoot 🌸",
    "C-SIDE",
    "starry-eyed smile",
    "DJ Re:Code",
    "seraphh",
    "algo",
    "Ecrylian",
    "eris mirror",
    "Mspo b2b GENDR FVVK",
    "soda drink",
    "smooch",
    "namonai",
    "FALSE L!FE",
    "guy with dog",
    "llythyryn mud b2b tilde",
    "Nico",
    "tdw",
    "Install a Billion Little Inchworms",
    "poosephine",
    "kanaris",
    "egwar",
    "agness",
    "duuzu (ft. Hayden Jason)",
    "Alaska Sargent",
    "eponym",
    "bio",
    "Expoded",
    "DJ Daddy Yonqui",
    "hellomynameisjoe",
    "Micah Callari",
    "Chvrchbvrner",
    "scottish woman",
    "keyesgen",
    "LIOMIODIO",
    "Kenny Riots",
    "LolaaFantasy",
    "babydactyl",
    "Malísima",
    "care6ul",
    "gryphon avery",
    "thed&benno",
    "BuzzyBee",
    "chk!dsk",
    "goh amed",
    "drow-z",
    ".C0D3",
    "flashmemories",
    "lustrafemme",
    "corvusCorteks",
    "twinkachu",
    "mentholgrrl",
    "clutrrglych",
    "FOAM SWORDS",
    "PennyVenum",
    "INVENTA",
    "emoticon",
]

const shuffled = names
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

module.exports = {
    names,
    shuffled,
    summary: shuffled.slice(0, 10),
}