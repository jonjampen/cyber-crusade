# Game Instructions
## Game Idea
You are part of a hacker group called "The Cyber Crusade". The goal of this group is to hack into vulnerable systems and therefore gain access. However, not all of your team members are loyal hackers, there are also some undercover agents among you.

The hackers have the goal to get full access to the system within 4 rounds of playing.
The agents try to prevent that by either stalling time or by decoying to hack into a honeypot.

## Game Preparation
You are randomly given a role, either hacker or agent (you can see your role below your name when playing a game). Each member gets 5 computer systems which they are responsible for (below your name you can see what types of computer systems you have).

### Types of computer systems
- **Honeypot:** Honeypots are bad for hackers since they alert the security system. If two (or three, depending on how many players are playing) honeypots are attacked, the hackers loose and the agents win.
- **Firewall:** Firewalls protect systems from getting hacked. They don't do any damage.
- **System:** Systems - or vulnerable systems - are the systems that are hackable. Hackers need access to all available vulnerable systems to win the game.

## Game Process
**! Important: You are allowed to lie during the entire game!**
1. You go through - player by player - and say what role you have (if you are a hacker or a agent). Remember: You may lie!
2. You go through - player by player - and say what types of computer systems you have.
3. The player who is marked in dark orange can now decide which computer system they want to attack. They cannot attack one of their own computer systems. The other players may talk to the active player and can persuade them.
4. If the active player has decided, they can click on a computer monitor to reveal what type of computer system they have attacked.
5. Now the new active player can decide which computer system they want to attack. Repeat step 3 and 4 until x systems are attacked (x being the number of players in the game).
6. The round is over, and one player has to click <ins>ok</ins> to continue to the next round. For the next round, each player will have one card less than in the round before.
7. repeat step 2-6 four times or until the game is over.

## Game Ending
There are three possible outcomes:

1. Hackers win: All the required vulnerable systems are attacked (in the side box you can see how many you have already attacked)
2. Agents win: All the required honeypots are found
3. Agents win: You have played all four rounds and none of the other two possible outcomes occurred.

<hr style="border: 1px solid var(--primary)">

# About This Project
## Contribute / Feedback
If you find a bug or have a feature request, please create an issue on my Github repository: <a href="https://github.com/jonjampen/cyber-crusade/issues" target="_blank">Submit an issue</a>

## Project
This project was built by Jon Jampen as a project for school. It is built with SvelteKit and Firestore.

<a href="https://github.com/jonjampen/cyber-crusade/" target="_blank">Project on Github</a>

[Contact](mailto:jon.jampen@cryptography.ch)

<a href="https://github.com/jonjampen/cyber-crusade/blob/main/TODO.md" target="_blank">Project Plan</a>