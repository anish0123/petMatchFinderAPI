/* eslint-disable node/no-unpublished-import */
import {Application} from 'express';
import {Category} from '../src/types/DBTypes';
import request from 'supertest';

const postCategory = (
  url: string | Application,
  token: string,
): Promise<Category> => {
  const category = {
    category_name: 'testCategory',
  };
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation AddCategory($category: CategoryInput!) {
          addCategory(category: $category) {
            category {
              category_name
              id
            }
            message
          }
        }`,
        variables: {
          category: category,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const categoryData = response.body.data.addCategory;
          expect(categoryData).toHaveProperty('message');
          expect(categoryData).toHaveProperty('category');
          expect(categoryData.category).toHaveProperty('id');
          expect(categoryData.category.category_name).toBe(
            category.category_name,
          );
          resolve(response.body.data.addCategory.category);
        }
      });
  });
};

const putCategory = (
  url: string | Application,
  token: string,
  id: string,
): Promise<Category> => {
  const category = {
    category_name: 'modifitedCategory',
  };
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation ModifyCategory($modifyCategoryId: ID!, $category: CategoryModifyInput!) {
          modifyCategory(id: $modifyCategoryId, category: $category) {
            category {
              category_name
              id
            }
            message
          }
        }`,
        variables: {
          modifyCategoryId: id,
          category: category,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const categoryData = response.body.data.modifyCategory;
          expect(categoryData).toHaveProperty('message');
          expect(categoryData).toHaveProperty('category');
          expect(categoryData.category).toHaveProperty('id');
          expect(categoryData.category.category_name).toBe(
            category.category_name,
          );
          resolve(response.body.data.modifyCategory);
        }
      });
  });
};

const deleteCategory = (
  url: string | Application,
  token: string,
  id: string,
): Promise<Category> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteCategory($deleteCategoryId: ID!) {
          deleteCategory(id: $deleteCategoryId) {
            category {
              category_name
              id
            }
            message
          }
        }`,
        variables: {
          deleteCategoryId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const categoryData = response.body.data.deleteCategory;
          expect(categoryData).toHaveProperty('message');
          expect(categoryData).toHaveProperty('category');
          expect(categoryData.category).toHaveProperty('id');
          expect(categoryData.category).toHaveProperty('category_name');
          resolve(response.body.data.deleteCategory);
        }
      });
  });
};

export {postCategory, putCategory, deleteCategory};
