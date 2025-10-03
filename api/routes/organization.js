"use strict";


module.exports = function (app) {
  const OrganizationController = require("../controllers/organization");
  const OrganizationVerification = require("../middleware/verifikasi-organization");


  //ACCOUNT CONTROLLER
  app.route(`/api/organization/login`)
    .post(OrganizationController.account_controller.login);

  app.route(`/api/organization/register`)
    .post(OrganizationController.account_controller.register);

  app.route(`/api/organization/profile`)
    .get(OrganizationVerification, OrganizationController.account_controller.profile);

  app.route(`/api/organization/profile/edit`)
    .put(OrganizationVerification, OrganizationController.account_controller.editProfile);

  app.route(`/api/organization/profile/edit/password`)
    .put(OrganizationVerification, OrganizationController.account_controller.editPassword);

  //EVENT CONTROLLER
  app.route(`/api/organization/events`)
    .get(OrganizationVerification, OrganizationController.event_controller.eventShow);

  app.route(`/api/organization/event/:id_event`)
    .get(OrganizationVerification, OrganizationController.event_controller.eventShowId);

  app.route(`/api/organization/event/add`)
    .post(OrganizationVerification, OrganizationController.event_controller.eventAdd);

  app.route(`/api/organization/event/edit/:id_event`)
    .put(OrganizationVerification, OrganizationController.event_controller.eventEdit);

  app.route(`/api/organization/event/delete/:id_event`)
    .delete(OrganizationVerification, OrganizationController.event_controller.eventDelete);


  //TICKET CONTROLLER
  app.route(`/api/organization/tickets/:id_event`)
    .get(OrganizationVerification, OrganizationController.ticket_controller.ticketShow);

  app.route(`/api/organization/ticket/:id_ticket`)
    .get(OrganizationVerification, OrganizationController.ticket_controller.ticketShowId);

  app.route(`/api/organization/ticket/add`)
    .post(OrganizationVerification, OrganizationController.ticket_controller.ticketAdd);

  app.route(`/api/organization/ticket/edit/:id_ticket`)
    .put(OrganizationVerification, OrganizationController.ticket_controller.ticketEdit);

  app.route(`/api/organization/ticket/set-amount/:id_ticket`)
    .put(OrganizationVerification, OrganizationController.ticket_controller.ticketSetAmount);

  app.route(`/api/organization/ticket/delete/:id_ticket`)
    .delete(OrganizationVerification, OrganizationController.ticket_controller.ticketDelete);

  //HISTORY CONTROLLER
  app.route(`/api/organization/histories`)
    .get(OrganizationVerification, OrganizationController.history_controller.showHistory);

  app.route(`/api/organization/history/:id_history`)
    .get(OrganizationVerification, OrganizationController.history_controller.showHistoryId);


  // ORDER
  app.route(`/api/organization/order/confirm/:id_history`)
    .put(OrganizationVerification, OrganizationController.order_controller.handleConfirm);

  app.route(`/api/organization/order/anomaly-transaction/:id_history`)
    .put(OrganizationVerification, OrganizationController.order_controller.handleAnomaly);

  app.route(`/api/organization/order/scan-ticket`)
    .put(OrganizationVerification, OrganizationController.order_controller.handleScanTicket);
};

