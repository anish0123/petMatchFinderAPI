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

## Test steps
**As a normal user**
1. Create an account
2. Login with your account
3. Navigate to an animal details
4. Adopt the animal.
5. Fill in details and submit applicaiton
6. Edit application details
7. Navigate to user profile
8. Update profile
9. Check user rating
10. View your adoption applications
11. Delete adoption application
12. Navigate to home and navigate to an animal details
13. Navigate to animal's owner details
14. Check rating and add rating for the user
15. Edit rating and delete rating
16. Navigate to add animal from nav bar
17. Fill the form and add animal
18. Edit details of animal
19. Use another account or admin account to apply for adoption
20 Login with your account and visit profile
21. Navigate to your animals and open animal details
22. Approve or reject application
  
**As admin user**
1. Login as admin
2. Navigate to categories page from nav bar
3. Add, edit and delete categories
4. Navigate to home page and open any animal details
5. Delete animal

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
