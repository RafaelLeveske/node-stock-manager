import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  response.json({
    Typescript: 'node-project-template',
  });
});

export default routes;
