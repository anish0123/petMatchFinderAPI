/* eslint-disable node/no-unpublished-import */
import {Application} from 'express';
import request from 'supertest';
import {Animal} from '../src/types/DBTypes';
import {UploadResponse} from '../src/types/MessageTypes';

const postAnimal = (
  url: string | Application,
  animal: Omit<Animal, 'id' | 'owner'>,
  token: string,
): Promise<Animal> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation addAnimal($animal: AnimalInput!) {
          addAnimal(animal: $animal) {
            animal {
              adoptionStatus
              animal_name
              birthdate
              description
              gender
              id
              image
              listedDate
              weight
            }
            message
          }
        }`,
        variables: {
          animal: animal,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const animalData = response.body.data.addAnimal;
          expect(animalData).toHaveProperty('message');
          expect(animalData).toHaveProperty('animal');
          expect(animalData.animal).toHaveProperty('id');
          expect(animalData.animal.animal_name).toBe(animal.animal_name);
          expect(animalData.animal.description).toBe(animal.description);
          resolve(response.body.data.addAnimal.animal);
        }
      });
  });
};

const postFile = (
  url: string | Application,
  token: string,
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('cat', 'test/picWithGPS.JPG')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const uploadMessageResponse = response.body;
          expect(uploadMessageResponse).toHaveProperty('message');
          expect(uploadMessageResponse).toHaveProperty('data');
          expect(uploadMessageResponse.data).toHaveProperty('filename');
          expect(uploadMessageResponse.data).toHaveProperty('location');
          expect(uploadMessageResponse.data.location).toHaveProperty(
            'coordinates',
          );
          expect(uploadMessageResponse.data.location).toHaveProperty('type');
          resolve(uploadMessageResponse);
        }
      });
  });
};

const putAnimal = (
  url: string | Application,
  id: string,
  token: string,
): Promise<Animal> => {
  const animal = {
    animal_name: 'editAnimal',
  };
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation modifyAnimal($modifyAnimalId: ID!, $animal: AnimalModify!) {
          modifyAnimal(id: $modifyAnimalId, animal: $animal) {
            animal {
              description
              birthdate
              animal_name
              adoptionStatus
              gender
              id
              image
              listedDate
              weight
              price
            }
            message
          }
        }`,
        variables: {
          animal: animal,
          modifyAnimalId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('response.body: ', response.body);
          const animalData = response.body.data.modifyAnimal;
          expect(animalData).toHaveProperty('message');
          expect(animalData).toHaveProperty('animal');
          expect(animalData.animal).toHaveProperty('id');
          expect(animalData.animal.animal_name).toBe(animal.animal_name);
          resolve(response.body.data.modifyAnimal.animal);
        }
      });
  });
};

const getAnimals = (url: string | Application): Promise<Animal[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `
        query Animals {
          animals {
            adoptionStatus
            animal_name
            birthdate
            description
            gender
            id
            image
            listedDate
            weight
          }
        }
        `,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const animals = response.body.data.animals;
          expect(animals).toBeInstanceOf(Array);
          expect(animals[0]).toHaveProperty('id');
          expect(animals[0]).toHaveProperty('animal_name');
          expect(animals[0]).toHaveProperty('description');
          resolve(response.body.data.users);
        }
      });
  });
};

const getAnimal = (url: string | Application, id: string): Promise<Animal> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query AnimalById($animalByIdId: ID!) {
          animalById(id: $animalByIdId) {
            adoptionStatus
            animal_name
            birthdate
            description
            gender
            id
            image
            listedDate
            weight
          }
        }`,
        variables: {
          animalByIdId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const animal = response.body.data.animalById;

          expect(animal.id).toBe(id);
          expect(animal).toHaveProperty('animal_name');
          expect(animal).toHaveProperty('description');
          resolve(response.body.data.userById);
        }
      });
  });
};

const getAnimalByOwner = (
  url: string | Application,
  id: string,
): Promise<Animal> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query getAnimalsByOwner($ownerId: ID!) {
          animalsByOwner(ownerId: $ownerId) {
            adoptionStatus
            animal_name
            birthdate
            description
            gender
            id
            image
            listedDate
            weight
          }
        }`,
        variables: {
          ownerId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('response: ', response.body);
          const animals = response.body.data.animalsByOwner;
          expect(animals).toBeInstanceOf(Array);
          expect(animals[0]).toHaveProperty('id');
          expect(animals[0]).toHaveProperty('animal_name');
          expect(animals[0]).toHaveProperty('description');
          resolve(response.body.data.animalsByOwner);
        }
      });
  });
};

const deleteAnimal = (
  url: string | Application,
  token: string,
  id: string,
): Promise<Animal> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteAnimal($deleteAnimalId: ID!) {
          deleteAnimal(id: $deleteAnimalId) {
            animal {
              adoptionStatus
              animal_name
              birthdate
              id
              description
            }
            message
          }
        }`,
        variables: {
          deleteAnimalId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('response: ', response.body);
          const animal = response.body.data.deleteAnimal;
          expect(animal.animal.id).toBe(id);
          expect(animal.animal).toHaveProperty('animal_name');
          expect(animal.animal).toHaveProperty('description');
          resolve(response.body.data.deleteAnimal.animal);
        }
      });
  });
};

export {
  postAnimal,
  postFile,
  putAnimal,
  getAnimals,
  getAnimal,
  getAnimalByOwner,
  deleteAnimal,
};
