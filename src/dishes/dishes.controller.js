const path = require('path');
const dishes = require('../data/dishes-data');
const nextId = require('../utils/nextId');

function dishIdValidation(req, res, next) {
  const { dishId } = req.params;
  const currentDishIndex = dishes.findIndex((dish) => dish.id === dishId);
  if (currentDishIndex >= 0) {
    res.locals.dishIndex = currentDishIndex;
    return next();
  } // gives us res.locals.dishIndex
  return next({ status: 404, message: `Dish does not exist: ${dishId}` });
}
function dishExistsInRequestBody(req, res, next) {
  const { data: request = {} } = req.body;
  const oldDish = dishes[res.locals.dishIndex];
  const newDish = {
    name: request.name,
    description: request.description,
    price: request.price,
    image_url: request.image_url,
  }; // gives us res.locals.newDish
  for (let propty in newDish) {
    let item = newDish[propty];
    if (propty === 'price' && typeof item !== 'number' || typeof item === 'number' && parseInt(item) <= 0) {
      return next({
        status: 400,
        message: `Dish must have a price that is an integer greater than 0`,
      });
    }
    if (item === undefined || (typeof item === 'string' && item.trim().length < 1)) {
      return next({ status: 400, message: `Dish must include a ${propty}` });
    }
  }
  if (request.id) {
    if (request.id === oldDish.id) {
      newDish.id = oldDish.id;
    } 
    else {
      return next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${oldDish.id}, Route: ${request.id}`,
      });
    }
  }else if (oldDish){
    newDish.id = oldDish.id;
  }
  else{
    newDish.id = nextId();
  }
  res.locals.newDish = newDish;
  return next();
}

function list(req, res) {
  res.status(200).json({ data: dishes });
}
function update(req, res) {
  dishes.splice(res.locals.dishIndex, 1, res.locals.newDish);
  res.status(200).json({ data: dishes[res.locals.dishIndex] });
}
function read(req, res) {
  res.status(200).json({ data: dishes[res.locals.dishIndex] });
}
function create(req, res) {
  dishes.push(res.locals.newDish);
  res.status(201).json({ data: res.locals.newDish });
}

module.exports = {
  read: [dishIdValidation, read],
  create: [dishExistsInRequestBody, create],
  update: [dishIdValidation, dishExistsInRequestBody, update],
  list,
};
