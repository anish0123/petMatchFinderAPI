# Pet Match Finder
Pet Match Finder is a project developed under Metropolia University of Applied Sciences's scope. It is an application where users are able to login, view pets, adopt pets or put pets for adoption online, provide ratings and feedback to other users. 

## Table of contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation steps](#installation-steps)
- [Author](#author)

## Features
+ **Register, Login, Logout**: Users can register, login, logout into the application by using their email.
+ **Add animals for adoption**: Users are able to add details of their animals that want to put for adoption.
+ **Edit or delete animal data**: Users are able to edit or delete animal data that they have uploaded.
+ **Apply for adoption**: Users are able to apply for adopting a pet through the application.
+ **Edit or delete adoption application**: Users are able to edit or delete their adoption applications.
+ **rate other users**: Users are able to rate and provide feedback to other users.

## Technologies
- TypeScript
- Node.js
- Express
- GraphQl
- Mongoose
- Socket.io
- Apollo Server

## Installation steps
- Clone this project
- CLone sub projects
  + [Auth Server](https://github.com/anish0123/PetMatchFinder-Auth)
  + [Upload Server](https://github.com/anish0123/petMatchFinder-Upload)
  + [Socket Server](https://github.com/anish0123/PetMatchFinder-Socket)
  + [Frontend](https://github.com/anish0123/petMatchFinder-GUI)- This could be optional.
- Create `.env` file and add following fields:
  + `NODE_ENV`
  + `PORT`
  + `DATABASE_URL`
  + `JWT_SECRET`
  + `AUTH_URL`
  + `UPLOAD_URL`
  + `SOCKET_URL`
- Run all the sub projects
- Run the project with `npm run dev`


## Author
Anish Maharjan
