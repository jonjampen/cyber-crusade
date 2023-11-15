const adjectives = [
    "Mysterious",
    "Enigmatic",
    "Shadowy",
    "Elusive",
    "Rogue",
    "Rebellious",
    "Daring",
    "Bold",
    "Fearless",
    "Intrepid",
    "Cunning",
    "Scheming",
    "Devious",
    "Wily",
    "Malicious",
    "Mercenary",
    "Subversive",
    "Insidious",
    "Diabolical",
    "Malevolent"
];
const nouns = [
    "code ninja",
    "script wizard",
    "keystroke smuggler",
    "bug whisperer",
    "digital outlaw",
    "programming rebel",
    "bug bounty hunter",
    "cyber warrior",
    "code warrior",
    "network adventurer",
    "code magician",
    "hacker extraordinaire",
    "keyboard sorcerer",
    "coding fox",
    "virus magician",
    "coding mercenary",
    "hacking mastermind",
    "cyber saboteur",
    "coding demon",
    "data tyrant"
];

export function randomName() {
    return adjectives[Math.round(Math.random() * 19)] + " " + nouns[Math.round(Math.random() * 19)]
}
