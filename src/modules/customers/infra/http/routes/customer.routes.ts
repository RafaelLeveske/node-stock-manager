import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import CustomersController from '../controller/CustomersController';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.use(ensureAuthenticated);

customersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required().uppercase(),
      email: Joi.string().email().empty(''),
      cpf: Joi.string().length(11).required(),
      phone: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .empty('')
        .default('00000000000'),
    },
  }),
  customersController.create,
);

export default customersRouter;
