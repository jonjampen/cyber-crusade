import { playersStore } from "$lib/stores/playersStore";
import { authUser } from "$lib/stores/authStore";

export function countOccurrences() {
    let cards = [];
    let players;
    playersStore.subscribe(val => players = val);
    let user;
    authUser.subscribe(val => user = val);

    players.forEach((player) => {
        if (player.uid === user.uid) {
            cards = player.cards;
        }
    });
    let targetCount = 0;
    let firewallCount = 0;
    let honeypotCount = 0;

    // Iterate through the cards array
    cards.forEach((card) => {
        switch (card.value) {
            case "target":
                targetCount++;
                break;
            case "firewall":
                firewallCount++;
                break;
            case "honeypot":
                honeypotCount++;
                break;
        }
    });

    return {
        target: targetCount,
        firewall: firewallCount,
        honeypot: honeypotCount,
    };
}