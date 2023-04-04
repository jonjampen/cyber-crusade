# Project Plan: Online Card Game
By Jon Jampen

## Goal
The goal is to create an online card game for multiple players. It can be played on a website which is built using Svelte and hosted on Vercel. The data is stored in a Firebase Firestore database..

## Project Plan
### V1 User Sign Up:
- [x] learn firebase basics
- [x] signing up users (email)
    - [x] firebase auth
    - [x] login / sign up / logout
    - [x] create document with user info
    - [x] in layout check if user is logged in or not (and redirect if necessary)
- [x] Waiting Room
### V2 Game Preparation:
- [x] option to start game -> creating games collection in db
- [x] getting updates from db
- [x] distribution of roles -> creating players collection in db
- [x] distribution of cards -> adding them to db
### V3 Game:
- [ ] game logic
    - [x] show all players and their cards
    - [x] flip cards by clicking on them (& update in db)
    - [x] add turned cards to game collection
    - [ ] only allow flipping if current player
    - [ ] display own role
    - [x] displaying collected cards, round #, and how many of each role
- [ ] check for and handle game over
    - [x] check game over (1)
    - [ ] check game over (2: no rounds left)
    - [ ] handle game over
- [ ] redistribute cards for new round
    - [ ] check if x cards are turned
### V4 Extensions:
- [ ] adjustments for more players
- [ ] visualization of cards
- [x] improve design
- [ ] several games at the same time
- [ ] write the game instructions

## Additional Materials
- Firebase documentation