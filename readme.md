# Grubdash

A hypothetical dining service which serves a single restaurant's needs. Using CRUD principles the owner could create, read, update and delete dishes from the server. Then anyone could create, read and update new orders. The data comes back using jsonapi specifications.

## Routes

| Folder/file path | Description                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/app.js`     | Directs requests to the appropriate routers.                                                                  |
| `src/orders/`    | Contains `orders.controller.js`, `orders.service.js` and `orders.router.js` files for the `/orders` resource. |
| `src/dishes/`    | Contains `dishes.controller.js`, `dishes.service.js` and `dishes.router.js` files for the `dishes` resource.  |
| `src/errors`     | Contains `errorHandler.js`, `methodNotFound.js` and `notFound.js`                                             |

| Endpoints                | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `GET  */orders`          | Returns a list of orders in the database.                                          |
| `POST */orders/`         | Performs validation then returns a new order in the database with ID.              |
| `GET */orders/(uuid)`    | Returns a specific order in the database.                                          |
| `UPDATE */orders/(uuid)` | Updates and returns a specific order in the database if its status is not pending. |
| `DELETE */orders/(uuid)` | Deletes a specific order in the database, only if its status is pending.           |
|                          |                                                                                    |
| `GET */dishes`           | Returns a list of dishes in the database.                                          |
| `POST */dishes`          | Creates a new dish in the database.                                                |
| `GET */dishes/:dishId`   | Returns a dish in the database.                                                    |
| `PUT */dishes/:dishId`   | Performs validation then updates and returns a dish in the database.               |
 Front end sold separately.
