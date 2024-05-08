/* eslint-disable node/no-unpublished-import */
import {Application} from 'express';
import request from 'supertest';
import {Rating} from '../src/types/DBTypes';

const postRating = (
  url: string | Application,
  rating: Omit<Rating, 'id' | 'ratedBy'>,
  token: string,
): Promise<Rating> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation addRating($rating: RatingInput!) {
          addRating(rating: $rating) {
            message
            rating {
              description
              id
              ratedBy {
                id
                email
              }
              ratedDate
              ratedTo {
                id
                email
              }
              rating
            }
          }
        }`,
        variables: {
          rating: rating,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const ratingData = response.body.data.addRating;
          expect(ratingData).toHaveProperty('message');
          expect(ratingData).toHaveProperty('rating');
          expect(ratingData.rating).toHaveProperty('id');
          expect(ratingData.rating).toHaveProperty('ratedDate');
          expect(ratingData.rating).toHaveProperty('ratedDate');
          expect(rating.description).toBe(rating.description);
          resolve(response.body.data.addRating.rating);
        }
      });
  });
};

const putRating = (
  url: string | Application,
  id: string,
  token: string,
): Promise<Rating> => {
  const rating = {
    rating: 1,
    description: 'modifiedDescription',
  };
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation ModifyRating($modifyRatingId: ID!, $rating: RatingModify!) {
          modifyRating(id: $modifyRatingId, rating: $rating) {
            message
            rating {
              description
              ratedBy {
                id
              }
              ratedDate
              id
              ratedTo {
                id
              }
              rating
            }
          }
        }`,
        variables: {
          rating: rating,
          modifyRatingId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const ratingData = response.body.data.modifyRating;
          expect(ratingData).toHaveProperty('message');
          expect(ratingData).toHaveProperty('rating');
          expect(ratingData.rating).toHaveProperty('id');
          expect(ratingData.rating).toHaveProperty('ratedDate');
          expect(ratingData.rating).toHaveProperty('ratedDate');
          expect(rating.description).toBe(rating.description);
          resolve(response.body.data.modifyRating.rating);
        }
      });
  });
};

const deleteRating = (
  url: string | Application,
  id: string,
  token: string,
): Promise<Rating> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteRating($deleteRatingId: ID!) {
          deleteRating(id: $deleteRatingId) {
            message
            rating {
              id
              ratedBy {
                id
              }
              description
              ratedDate
              ratedTo {
                id
              }
              rating
            }
          }
        }`,
        variables: {
          deleteRatingId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const ratingData = response.body.data.deleteRating;
          expect(ratingData).toHaveProperty('message');
          expect(ratingData).toHaveProperty('rating');
          expect(ratingData.rating).toHaveProperty('id');
          expect(ratingData.rating).toHaveProperty('ratedDate');
          expect(ratingData.rating).toHaveProperty('ratedDate');
          resolve(response.body.data.deleteRating.rating);
        }
      });
  });
};

export {postRating, putRating, deleteRating};
