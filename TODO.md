# Project Plan: Online Card Game
By Jon Jampen

## Goal
The goal is to create an online card game for multiple players. It can be played on a website which is built using Svelte and hosted on Vercel. The data is stored in a Firebase Firestore database. The game idea is based on a game called “Tempel des Schreckens”.

## Project Plan
### V1 User Sign Up:
- [ ] learn firebase basics
- [ ] signing up users (anonymously)
- [ ] Waiting Room
### V2 Game Preparation:
- [ ] option to start game -> creating games collection in db
- [ ] getting updates from db
- [ ] distribution of roles -> creating players collection in db
- [ ] distribution of cards -> adding them to db
### V3 Game:
- [ ] game logic (order of players, flip the cards, collecting cards by type)
- [ ] visualization of cards
- [ ] check for and handle game over
- [ ] redistribute cards for new round
### V4 Extensions:
- [ ] adjustments for more players
- [ ] option to join a game with ID (several games at the same time)
- [ ] write the game instructions
### V5 Optional:
- [ ] signup with email & password
- [ ] score board

## Additional Materials
•	Firebase documentation
•	“Tempel des Schreckens” game and instructions