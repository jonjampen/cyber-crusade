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
- [x] game logic
    - [x] show all players and their cards
    - [x] flip cards by clicking on them (& update in db)
    - [x] add turned cards to game collection
    - [x] only allow flipping if current player
    - [x] display own role
    - [x] displaying collected cards, round #, and how many of each role
    - [x] show the user their cards & shuffle for the other players
- [x] check for and handle game over
    - [x] check game over (1)
    - [x] check game over (2: no rounds left)
    - [x] handle game over
- [x] redistribute cards for new round
    - [x] check if x cards are turned
### V4 Extensions:
- [x] adjustments for more players
- [x] visualization of cards
- [x] improve design
- [ ] Bug fixes
    - [x] disable click if already flipped
    - [x] display login error (currently only with alert)
    - [x] redirect after login
- [x] write the game instructions
- [x] several games at the same time
- [ ] scorer board

## Additional Materials
- Firebase documentation