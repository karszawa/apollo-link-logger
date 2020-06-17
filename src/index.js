/* eslint-disable import/no-unresolved,import/extensions */
import { ApolloLink } from 'apollo-link';
import formatMessage from './formatMessage';
import logging from './logging';

export const createLoggerLink = ({ stringify = false }) =>
  new ApolloLink((operation, forward) => {
    const startTime = new Date().getTime();

    return forward(operation).map(result => {
      const operationType = operation.query.definitions[0].operation;
      const ellapsed = new Date().getTime() - startTime;

      const group = formatMessage(operationType, operation, ellapsed);

      logging.groupCollapsed(...group);

      logging.log('INIT', stringify ? JSON.stringify(stringify) : operation);
      logging.log('RESULT', stringify ? JSON.stringify(result) : result);

      logging.groupEnd(...group);
      return result;
    });
  });

export default createLoggerLink;
