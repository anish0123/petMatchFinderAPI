/* eslint-disable node/no-unpublished-import */
import {Application} from 'express';
import request from 'supertest';
import {AdoptionApplication} from '../src/types/DBTypes';

const postAdoptionApplication = (
  url: string | Application,
  input: Omit<AdoptionApplication, 'id' | 'adopter' | 'applicationStatus'>,
  token: string,
): Promise<AdoptionApplication> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation addAdoptionApplication($input: AdoptionApplicationInput!) {
          addAdoptionApplication(input: $input) {
            adoptionApplication {
              adopter {
                id
              }
              animal {
                id
              }
              appliedDate
              description
              id
              applicationStatus
            }
            message
          }
        }`,
        variables: {
          input: input,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const applicationData = response.body.data.addAdoptionApplication;
          expect(applicationData).toHaveProperty('message');
          expect(applicationData).toHaveProperty('adoptionApplication');
          expect(applicationData.adoptionApplication).toHaveProperty('id');
          expect(applicationData.adoptionApplication).toHaveProperty('adopter');
          expect(applicationData.adoptionApplication).toHaveProperty('animal');
          expect(applicationData.adoptionApplication.description).toBe(
            input.description,
          );
          resolve(
            response.body.data.addAdoptionApplication.adoptionApplication,
          );
        }
      });
  });
};

const putAdoptionApplication = (
  url: string | Application,
  id: string,
  token: string,
): Promise<AdoptionApplication> => {
  const input = {
    description: 'editedDescription',
  };
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation modifyApplication($modifyAdoptionApplicationId: ID!, $input: AdoptionApplicationModify!) {
          modifyAdoptionApplication(id: $modifyAdoptionApplicationId, input: $input) {
            adoptionApplication {
              adopter {
                id
              }
              animal {
                id
              }
              applicationStatus
              appliedDate
              description
              id
            }
            message
          }
        }`,
        variables: {
          input: input,
          modifyAdoptionApplicationId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const applicationData = response.body.data.modifyAdoptionApplication;
          expect(applicationData).toHaveProperty('message');
          expect(applicationData).toHaveProperty('adoptionApplication');
          expect(applicationData.adoptionApplication.id).toBe(id);
          expect(applicationData.adoptionApplication).toHaveProperty('adopter');
          expect(applicationData.adoptionApplication).toHaveProperty('animal');
          expect(applicationData.adoptionApplication.description).toBe(
            'editedDescription',
          );
          expect(applicationData.adoptionApplication.description).toBe(
            input.description,
          );
          resolve(
            response.body.data.modifyAdoptionApplication.adoptionApplication,
          );
        }
      });
  });
};

const deleteAdoptionApplication = (
  url: string | Application,
  id: string,
  token: string,
): Promise<AdoptionApplication> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteAdoptionApplication($deleteAdoptionApplicationId: ID!) {
          deleteAdoptionApplication(id: $deleteAdoptionApplicationId) {
            message
            adoptionApplication {
              adopter {
                id
              }
              animal {
                id
              }
              applicationStatus
              appliedDate
              description
              id
            }
          }
        }`,
        variables: {
          deleteAdoptionApplicationId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const applicationData = response.body.data.deleteAdoptionApplication;
          expect(applicationData).toHaveProperty('message');
          expect(applicationData).toHaveProperty('adoptionApplication');
          expect(applicationData.adoptionApplication.id).toBe(id);
          expect(applicationData.adoptionApplication).toHaveProperty('adopter');
          expect(applicationData.adoptionApplication).toHaveProperty('animal');
          expect(applicationData.adoptionApplication.description).toBe(
            'editedDescription',
          );
          resolve(
            response.body.data.deleteAdoptionApplication.adoptionApplication,
          );
        }
      });
  });
};

export {
  postAdoptionApplication,
  putAdoptionApplication,
  deleteAdoptionApplication,
};
