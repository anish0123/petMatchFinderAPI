# Pet Match Finder
Pet Match Finder is a server side project developed under Metropolia University of Applied Sciences's scope. It is an application where users are able to login, view pets, adopt pets or put pets for adoption online, provide ratings and feedback to other users. It is a graphQl server built with TypeScript, Node.js and Express. The main aim of this app is to create seamless interface for pet adoption. 


## Table of contents
- [Features](#features)
- [Links for testing](#links-for-testing)
- [Usage and target groups](#usage-and-target-groups)
- [Technologies](#technologies)
- [Installation steps](#installation-steps)
- [Related](#related)
- [Demo](#demo)
 - [Author](#author)

## Features
+ **Register, Login, Logout**: Users can register, login, logout into the application by using their email.
+ **Add animals for adoption**: Users are able to add details of their animals that want to put for adoption.
+ **Edit or delete animal data**: Users are able to edit or delete animal data that they have uploaded.
+ **Apply for adoption**: Users are able to apply for adopting a pet through the application.
+ **Edit or delete adoption application**: Users are able to edit or delete their adoption applications.
+ **rate other users**: Users are able to rate and provide feedback to other users.

## Links for testing
- [Azure GraphQl server](https://anishm-pet-match-finder-api.azurewebsites.net/graphql)
- [Pet Match Finder- UI](https://anish0123.github.io/petMatchFinder-GUI/)

## Usage and target groups
The usage of this application is to make online pet adoption smooth, easy and time saving. The target groups are pet lovers who want to adopt pets and users who want to put pet for adoption like breeders, animal shelters and so on.

## Technologies
- TypeScript
- Node.js
- Express
- GraphQl
- Socket.io
- Apollo Server
- MongoDB
- Azure Webapp services

## Installation steps
- Clone this project
- CLone sub projects
  + [Auth Server](https://github.com/anish0123/PetMatchFinder-Auth)
  + [Upload Server](https://github.com/anish0123/petMatchFinder-Upload)
  + [Socket Server](https://github.com/anish0123/PetMatchFinder-Socket)
  + [Frontend](https://github.com/anish0123/petMatchFinder-GUI)
- Create `.env` file and add following fields:
  
   ```
  NODE_ENV=development
  PORT=3000
  DATABASE_URL=
  JWT_SECRET=
  AUTH_URL=
  UPLOAD_URL=
  SOCKET_URL=
   ```
- Run all the sub projects
- Run the project with `npm run dev`

## Related
- [Trello Board: User Stories](https://trello.com/b/oClBeZTq/user-stories)
- [Trello Board: Product Backlog](https://trello.com/b/hegwsxqj/product-backlog)

## Demo
[![DemoVideo](https://img.youtube.com/vi/KrspxuMndt0/0.jpg)](https://youtu.be/KrspxuMndt0)



## Author
[Anish Maharjan](https://github.com/anish0123)
