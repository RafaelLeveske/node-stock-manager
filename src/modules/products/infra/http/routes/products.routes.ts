import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.use(ensureAuthenticated);

productsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required().uppercase(),
      brand: Joi.string().required().uppercase(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
    },
  }),
  productsController.create,
);

export default productsRouter;
