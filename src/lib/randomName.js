const adjectives = [
    "Cryptic",
    "Stealthy",
    "Intrusive",
    "Clever",
    "Shadowy",
    "Sly",
    "Dexterous",
    "Covert",
    "Untraceable",
    "Insidious",
    "Devious",
    "Subversive",
    "Cryptic",
    "Evasive",
    "Nimble",
    "Elusive",
    "Decisive",
    "Silent",
    "Strategic",
    "Ruthless"
];

const nouns = [
    "Cipher",
    "Infiltrator",
    "Cracker",
    "Phreak",
    "Saboteur",
    "Hacker",
    "Sorcerer",
    "Silencer",
    "Phantom",
    "Technomancer",
    "Hustler",
    "Rogue",
    "Blade",
    "Prowler",
    "Shadow",
    "Netrunner",
    "Vigilante",
    "Enigma",
    "Schemer",
    "Sentinel"
];


export function randomName() {
    return adjectives[Math.round(Math.random() * 19)] + " " + nouns[Math.round(Math.random() * 19)]
}
