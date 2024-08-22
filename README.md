# Fancy-Social-Network-API

## Description
This project is a backend API for a social network web application where users can share thoughts, react to friends' thoughts, and create a friend list. It's built using Express.js for routing, MongoDB as the database, and Mongoose ODM.

## Table of contents
- [Installation](#installation)
- [Usage](#usage)
- [Api Routes](#api-routes)
- [Technologies Used](#technologies-used)
- [Demo](#demo)
- [Contributing](#contributing)
- [Questions](#questions)


## Installation
1 -Clone the repository

2 -Install dependencies with `npm install`

3 -Ensure MongoDB is installed on your machine

4 -Start the server with `npm start`


## Usage
After starting the server, you can use Insomnia or a similar tool to test the API routes.

## API Routes

### Users
GET `/api/users` - Get all users

GET `/api/users/:id` - Get a single user by ID

POST `/api/users` - Create a new user

PUT `/api/users/:id` - Update a user

DELETE `/api/users/:id` - Delete a user

### Friends
POST `/api/users/:userId/friends/:friendId` - Add a friend

DELETE `/api/users/:userId/friends/:friendId` - Remove a friend

### Thoughts
GET `/api/thoughts` - Get all thoughts

GET `/api/thoughts/:id` - Get a single thought by ID

POST `/api/thoughts` - Create a new thought

PUT `/api/thoughts/:id` - Update a thought

DELETE `/api/thoughts/:id` - Delete a thought

## Technologies Used

- ExpressJS

- MongoDB

- Mongoose

- JavaScript

## Demo
https://drive.google.com/file/d/1HjDVyxUBSFs5mSB64YPYRnoPYceAyQZl/view?usp=drive_link

## Contributing
Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.

## Questions

If you have any questions about the repo, open an issue or contact me directly at m.e.penafernandez@gmail.com
