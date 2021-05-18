const path = require('path');
const orders = require('../data/orders-data');
const nextId = require('../utils/nextId');

function orderIdValidation(req, res, next) {
  const { orderId } = req.params;
  const currentOrderIndex = orders.findIndex((order) => order.id === orderId);
  if (currentOrderIndex >= 0) {
    res.locals.orderIndex = currentOrderIndex;
    return next();
  } // gives us res.locals.orderIndex
  return next({ status: 404, message: `Order does not exist: ${orderId}` });
}
function orderExistsInRequestBody(req, res, next) {
  const { data: request = {} } = req.body;
  const requiredProperties = ['deliverTo', 'mobileNumber', 'dishes'];
  const oIndex = res.locals.orderIndex;
  let messages = [];
  Object.keys(request).filter((field) => {
    if (requiredProperties.includes(field)) {
      const value = request[field];
      if (!value) return true;
      if (field == 'dishes') {
        if (!Array.isArray(value) || !value.length) {
          messages.push(`Order must include at least one dish`);
          return true;
        }
        let dishIndex;
        const dishesHaveQuantity = value.every((dish, index) => {
          if (typeof dish.quantity !== 'number') {
            dishIndex = index;
            return false;
          }
          if (dish.quantity <= 0) {
            dishIndex = index;
            return false;
          }
          return true;
        });
        if (!dishesHaveQuantity)
          messages.push(`Dish ${dishIndex} must have a quantity that is an integer greater than 0`);
      }
      const reqPropIndex = requiredProperties.findIndex((thing) => thing === field);
      requiredProperties.splice(reqPropIndex, 1);
      return false;
    }
    return true;
  });
  if (messages.length) return next({ status: 400, message: `${messages.join(', ')}` });
  if (requiredProperties.length)
    return next({ status: 400, message: `A ${requiredProperties[0]} is required` });
  if (request.id) {
    if (request.id !== orders[oIndex].id) {
      return next({ status: 400, message: `Id ${request.id} must match id in route` });
    }
  }
  if (Object.keys(request).includes('status') || oIndex >= 0) {
    if (request.status === 'delivered') {
      return next({ status: 400, message: `A delivered order cannot be changed` });
    }
    if (['pending', 'preparing', 'out-for-delivery'].includes(request.status)) {
      res.locals.newOrder = { ...request, id: orders[oIndex].id };
      return next();
    }
    return next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery`,
    });
  }
  if (!request.status) {
    res.locals.newOrder = { id: nextId(), ...request };
    return next();
  }
}

function list(req, res) {
  res.status(200).json({ data: orders });
}
function update(req, res) {
  orders.splice(res.locals.orderIndex, 1, res.locals.newOrder);
  res.status(200).json({ data: orders[res.locals.orderIndex] });
}
function read(req, res) {
  res.status(200).json({ data: orders[res.locals.orderIndex] });
}
function create(req, res) {
  orders.push(res.locals.newOrder);
  res.status(201).json({ data: res.locals.newOrder });
}
function destroy(req, res, next) {
  if (orders[res.locals.orderIndex].status !== 'pending') {
    return next({ status: 400, message: 'An order cannot be deleted unless it is pending' });
  }
  orders.splice(orders[res.locals.orderIndex], 1);
  res.sendStatus(204);
}

module.exports = {
  read: [orderIdValidation, read],
  create: [orderExistsInRequestBody, create],
  update: [orderIdValidation, orderExistsInRequestBody, update],
  list,
  delete: [orderIdValidation, destroy],
};
