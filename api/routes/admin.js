"use strict";


module.exports = function (app) {
  const AdminController = require("../controllers/admin");
  const AdminVerification = require("../middleware/verifikasi-admin");

  //LOGIN
  app.route(`/api/admin/login`)
    .post(AdminController.account_controller.login);

  // ORGANIZATIONS
  app.route(`/api/admin/organizations`)
    .get(AdminVerification, AdminController.organization_controller.orgShow);

  app.route(`/api/admin/organization/:id_organization`)
    .get(AdminVerification, AdminController.organization_controller.orgShowId);

  app.route(`/api/admin/organization/approve/:id_organization`)
    .put(AdminVerification, AdminController.organization_controller.orgApprove);

  app.route(`/api/admin/organization/banned/:id_organization`)
    .put(AdminVerification, AdminController.organization_controller.orgBanned);

  app.route(`/api/admin/organization/reject/:id_organization`)
    .delete(AdminVerification, AdminController.organization_controller.orgReject);

  // EVENTS
  app.route(`/api/admin/events`)
    .get(AdminVerification, AdminController.event_controller.eventShow);

  app.route(`/api/admin/event/:id_event`)
    .get(AdminVerification, AdminController.event_controller.eventShowId);

  app.route(`/api/admin/event/reject/:id_event`)
    .put(AdminVerification, AdminController.event_controller.eventReject);

  app.route(`/api/admin/event/approve/:id_event`)
    .put(AdminVerification, AdminController.event_controller.eventApprove);

};

