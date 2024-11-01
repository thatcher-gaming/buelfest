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
    "in barbados eatin sushi like im kung fu",
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
    
const links = {
    "chk!dsk": "https://soundcloud.com/dicksoak",
    "lustrafemme": "https://soundcloud.com/dj-lustrafemme",
    "smooch": "https://soundcloud.com/lilsmooch",
    "YARHGANG": "https://crimp.world",
    "The Dimmest Bulb": "https://thedimmestbulb.bandcamp.com/music",
    "Mspo b2b GENDR FVVK": "",
    "Expoded": "https://on.soundcloud.com/ipDpC",
    "kanaris": "https://kanaris.net",
    "llythyryn mud b2b tilde": "https://www.youtube.com/channel/UCo6YPJNsO_FCuLSX18gn5ag",
    "fuck": "https://mackenziereal.bandcamp.com/",
    "Teetow": "https://soundcloud.com/teetow",
    "scottish woman": "https://soundcloud.com/taylormaywhat",
    "babydactyl": "https://soundcloud.com/babydactyl",
    "Kenny Riots": "https://linktr.ee/kennyriots",
    "flyman347": "https://sorrowsofthemen.bandcamp.com/",
    "PegasYs": "https://x.com/Chromypone",
    "eponym": "https://soundcloud.com/eponymeponym",
    "bio": "https://biobiobio.bio/",
    "SÍODA": "https://sioda.ie/links/",
    "Nico": "https://galvanisticyoungboy.bandcamp.com",
    "curro's cube": "https://twitter.com/curroscube",
    "DJ NRA": "",
    "PennyVenum": "https://on.soundcloud.com/1TQV2qCCk8nJijdy8",
    "PANDAMONEYUM": "https://x.com/PANDAMONEYUMM",
    "sapphire brew": "https://soundcloud.com/liquidisotek",
    "incarnate": "https://soundcloud.com/incarnatemus",
    "savoa": "https://soundcloud.com/SAVOA",
    "twinkachu": "https://twitter.com/twinkachu_",
    "Install a Billion Little Inchworms": "https://open.spotify.com/artist/1YNWNTK8U1drNXyBdSxE1u?si=A_cngNG8SmGYlaqm_0y-qw",
    "soda drink": "https://soundcloud.com/odd_soda",
    "Learke": "https://linktr.ee/learke",
    "duuzu ft. Hayden Jason": "https://twitter.com/duuzu_",
    "rhx34": "https://www.instagram.com/burdenondoomsday/",
    "heydron": "https://cl59music.bandcamp.com",
    "DJ GATOR AIDS": "https://soundcloud.com/uwuntuwu",
    "KittyPuppy": "https://soundcloud.com/1-800-kittypuppy",
    "nevermindful": "https://soundcloud.com/nevermindful",
    "tdw": "https://soundcloud.com/tdw3",
    "pacificship": "https://linktr.ee/pacificship",
    "starry-eyed smile": "https://starry-eyedsmile.bandcamp.com/",
    "INVENTA": "https://soundcloud.com/iminventa",
    "FOAM SWORDS": "https://linktr.ee/foamswords",
    "namonai": "https://soundcloud.com/namonaai",
    "Ecrylian": "https://Ecrylian.bandcamp.com/",
    "nyla♡": "https://soundcloud.com/nylaisntreal",
    "Malísima": "http://malisima.info",
    "tallgrll": "https://soundcloud.com/tall-grll",
    "Chvrchbvrner": "https://chvrchbvrning.bandcamp.com/",
    "arkyalina": "https://open.spotify.com/artist/3GdBW0d16kqcdczbGIjHTd?si=p6AdjhYlTsyvlGfRdbFvFg",
    "Jem": "",
    "egwar": "https://soundcloud.com/egwar",
    "MOOF <333": "",
    "Bonbon": "https://cohost.org/Bonbon",
    "Renii.Star": "https://soundcloud.com/reniistar",
    "BuzzyBee": "https://www.youtube.com/@buzzybeemusic7394",
    "LolaaFantasy": "https://www.instagram.com/lolaafantazy/",
    "Micah Callari": "https://twitter.com/MicahCallari27 https://www.instagram.com/micahcallarimusic/",
    "Stational": "https://soundcloud.com/thekidstat",
    "irselr": "https://soundcloud.com/iriseller",
    "scoot 🌸": "https://www.youtube.com/@scoot_flower_emoji",
    "a positive organ company": "https://x.com/butterflyboymsc?t=RUSaJCnpg_HGqHgHNUWf1w&s=09",
    "Chanpaiix": "https://www.youtube.com/@Chanpaiix",
    "clutrrglych": "",
    "gryphon avery": "https://gryphonavery.bandcamp.com/",
    "kryptid": "https://soundcloud.com/kryptozoology",
    "lumaline": "https://soundcloud.com/lumaline",
    "a.pathrose": "https://linktr.ee/apathrose",
    "illusorily": "https://m.soundcloud.com/illusorily",
    "drow-z": "https://soundcloud.com/arealhamster",
    "flashmemories": "https://youtube.com/@flashmemories",
    "habiboi": "https://soundcloud.com/habiboi",
    "haven": "https://soundcloud.com/havenclub",
    "FALSE L!FE": "https://www.voidroot.net/false-life",
    "wormhole!!": "https://open.spotify.com/artist/0hcD69JIQUlAfPfKSHwW4f?si=Nk8yg8FSQgSYp0Qsnpi9VQ",
    "Voidsong": "https://on.soundcloud.com/gbjfpdFVcibkgUzx6",
    "hellomynameisjoe": "https://hellomynameisjoe.pronounmail.com",
    "DJ Daddy Yonqui": "https://soundcloud.com/daddyyonqui",
    "P3RC!": "https://linktr.ee/p3rcmusic",
    "corvusCorteks": "https://corteks.wixsite.com/music",
    "emoticon": "https://soundcloud.com/emot1con",
    "Trash Panda QC": "https://yplu.bandcamp.com",
    "Another Love": "https://linktr.ee/another_lovelovelove",
    "mentholgrrl": "https://twitter.com/mintymints7",
    "KYTH3": "https://soundcloud.com/kyth3",
    "PLUSTWENTYFOUR": "https://www.instagram.com/plustwentyfour/",
    "agness": "https://soundcloud.com/hugefishy",
    "seraphh": "https://soundcloud.com/wrathpriest",
    "Laura97": "https://twitter.com/mem0ry97",
    ".C0D3": "https://soundcloud.com/d0tcode",
    "goh amed": "https://open.spotify.com/artist/2UpPWIHKnbU6jQYQ20NMN8",
    "Coffiton": "",
    "in barbados eatin sushi like im kung fu": "https://x.com/cnri_twt",
    "littleflodus": "https://linktr.ee/littleflodus",
    "dynastic": "https://dynastic.bandcamp.com/",
    "Ojela": "https://linktr.ee/ojela000arg",
    "hyperlnxx": "https://soundcloud.com/hyperlnxx",
    "DARYA PLUR": "https://soundcloud.com/dary4",
    "eris mirror": "https://eris-mirror.carrd.co/",
    "keyesgen": "",
    "gndrfvk": "https://on.soundcloud.com/Qdovtqwnq83gmnmu6",
    "LIOMIODIO": "",
    "Alaska Sargent": "https://alaskasargent.com",
    "care6ul": "https://on.soundcloud.com/xjKpZLYNGrzKKd5U8",
    "Karman": "https://open.spotify.com/artist/5qwYGlMv7b8NMHkqrMzF5y?si=O7rjt3p7SQSJhlWJNUmkiQ",
    "Whitefish": "",
    "algo": "https://on.soundcloud.com/g9ZRu",
    "C-SIDE": "https://patheticgirl.bandcamp.com",
    "thed&benno": "https://soundcloud.com/thedbenno",
    "guy with dog": "https://guywith.dog"
};

module.exports = {
    names,
    shuffled,
    summary: shuffled.slice(0, 10),
    links
}
