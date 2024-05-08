import {GraphQLError} from 'graphql';

/**
 * Method to fetch data from other server
 * @param url  server url
 * @param options request options
 * @returns response
 */
const fetchData = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (!response.ok) {
      const message = json.message;
      throw new GraphQLError(message, {
        extensions: {
          code: response.statusText,
        },
      });
    }
    return json;
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message, {
      extensions: {
        code:
          (error as GraphQLError).extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

export default fetchData;
