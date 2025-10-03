"use strict";

module.exports = function (app) {
  const UserController = require("../controllers/user");
  const UserVerification = require("../middleware/verifikasi-user");

  // ACCOUNT CONTROLLER
  app
    .route(`/api/user/register`)
    .post(UserController.account_controller.register);

  app.route(`/api/user/login`).post(UserController.account_controller.login);

  app
    .route("/api/user/profile")
    .get(UserVerification, UserController.account_controller.profile);

  app
    .route("/api/user/profile/edit")
    .put(UserVerification, UserController.account_controller.editProfile);

  app
    .route("/api/user/profile/password")
    .put(UserVerification, UserController.account_controller.editPassword);

  // EVENT CONTROLLER
  app
    .route("/api/user/events") // ?limit=(int)
    .get(UserVerification, UserController.event_controller.eventAll);

  app
    .route("/api/user/events/recommended") // RANDOM ?limit=(int)
    .get(UserVerification, UserController.event_controller.eventRecommended);

  app
    .route("/api/user/event/:id_event")
    .get(UserVerification, UserController.event_controller.eventId);


  // HISTORY CONTROLLER
  app
    .route("/api/user/histories") // ?paid=(int)
    .get(UserVerification, UserController.history_controller.showHistory);

  app
    .route("/api/user/history/:id_history")
    .get(UserVerification, UserController.history_controller.showHistoryId);

  // ORDER CONTROLLER
  // POST MAKE ORDER => HISTORIES(AMOUNT) PAID = 0 (TOTAL = PRICE * AMOUNT + 3INT)
  // => RESPONSE PLEASE PAY IN 10 MINUTES
  // PUT CANCEL ORDER => SET PAID = 1
  // PUT CONFIRM ORDER => CHECK 10 MINUTES => SET T.SOLD += H.AMOUNT => SET PAID =2 => SET UNIQUE CODE => RESPONSE WAITING CONFIRM

  app
    .route("/api/user/order")
    .post(UserVerification, UserController.order_controller.makeOrder);

  app
    .route("/api/user/order/cancel/:id_history")
    .put(UserVerification, UserController.order_controller.cancelOrder);

  app
    .route("/api/user/order/confirm/:id_history")
    .put(UserVerification, UserController.order_controller.confirmOrder);
};
