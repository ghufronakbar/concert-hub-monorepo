"use strict";

const connection = require("../../connection");

exports.ticketShow = async (req, res) => {
  const id_organization = req.decoded.id_organization;
  const id_event = req.params.id_event;
  const qTicketShow = `
        SELECT 
            t.id_ticket, t.id_event, t.type AS ticket_type, t.amount, t.sold, t.price, t.date_start, t.date_end, 
            e.event_name, e.description, e.location, e.event_image, e.site_plan_image, e.type AS event_type, e.status,
            e.event_start, e.event_end, e.created_at 
        FROM tickets AS t 
        JOIN events AS e ON t.id_event = e.id_event 
        WHERE e.id_organization=? AND  e.id_event=? `;

  connection.query(qTicketShow, [id_organization, id_event], (error, rows) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    } else {
      const result = rows.map((row) => ({
        id_ticket: row.id_ticket,
        id_event: row.id_event,
        ticket_type: row.ticket_type,
        amount: row.amount,
        sold: row.sold,
        price: row.price,
        date_start: row.date_start,
        date_end: row.date_end,
        event_name: row.event_name,
        description: row.description,
        location: row.location,
        event_image: row.event_image
          ? process.env.BASE_URL + `/images/event/` + row.event_image
          : null,
        site_plan_image: row.site_plan_image
          ? process.env.BASE_URL + `/images/site-plan/` + row.site_plan_image
          : null,
        event_type: row.event_type,
        status: row.status,
        event_start: row.event_start,
        event_end: row.event_end,
        created_at: row.created_at,
      }));

      return res.status(200).json(result);
    }
  });
};

exports.ticketShowId = async (req, res) => {
  const id_organization = req.decoded.id_organization;
  const id_ticket = req.params.id_ticket;
  const qTicketShow = `
        SELECT 
            t.id_ticket, t.id_event, t.type AS ticket_type, t.amount, t.sold, t.price, t.date_start, t.date_end, 
            e.event_name, e.description, e.location, e.event_image, e.site_plan_image, e.type AS event_type, e.status,
            e.event_start, e.event_end, e.created_at 
        FROM tickets AS t 
        JOIN events AS e ON t.id_event = e.id_event 
        WHERE e.id_organization=? AND  t.id_ticket=? `;

  connection.query(qTicketShow, [id_organization, id_ticket], (error, rows) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    } else {
      const result = rows.map((row) => ({
        id_ticket: row.id_ticket,
        id_event: row.id_event,
        ticket_type: row.ticket_type,
        amount: row.amount,
        sold: row.sold,
        price: row.price,
        date_start: row.date_start,
        date_end: row.date_end,
        event_name: row.event_name,
        description: row.description,
        location: row.location,
        event_image: row.event_image
          ? process.env.BASE_URL + `/images/event/` + row.event_image
          : null,
        site_plan_image: row.site_plan_image
          ? process.env.BASE_URL + `/images/site-plan/` + row.site_plan_image
          : null,
        event_type: row.event_type,
        status: row.status,
        event_start: row.event_start,
        event_end: row.event_end,
        created_at: row.created_at,
      }));

      return res.status(200).json(result);
    }
  });
};

exports.ticketAdd = async (req, res) => {
  const { type, price, date_start, date_end, id_event } = req.body;

  if (!type || !price || !date_start || !date_end) {
    return res
      .status(400)
      .json({ status: 400, message: "Field can't be blank" });
  } else {
    const now = new Date();
    const startDate = new Date(date_start);
    const endDate = new Date(date_end);

    if (startDate < now) {
      return res
        .status(401)
        .json({
          status: 401,
          message: "Start time must not be earlier than the current time.",
        });
    } else if (startDate > endDate) {
      return res
        .status(402)
        .json({
          status: 402,
          message: "Finish time must not be earlier than start time.",
        });
    } else {
      const qTicketAdd = `INSERT INTO tickets(id_event,type,amount,sold,price,date_start,date_end) VALUES(?,?,?,?,?,?,?)`;
      const vTicketAdd = [
        id_event,
        type,
        0,
        0,
        price,
        new Date(date_start),
        new Date(date_end),
      ];
      connection.query(qTicketAdd, vTicketAdd, (error, rows, result) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ status: 500, message: "Internal Server Error" });
        } else {
          return res
            .status(200)
            .json({ status: 200, message: "Ticket added successfully" });
        }
      });
    }
  }
};

exports.ticketEdit = async (req, res) => {
  const { type, price, date_start, date_end } = req.body;
  const id_ticket = req.params.id_ticket;
  if (!type || !price || !date_start || !date_end) {
    return res
      .status(403)
      .json({ status: 403, message: "Field can't be blank" });
  } else {
    const qTicketEdit = `UPDATE tickets SET type=?, price=?, date_start=?, date_end=? WHERE id_ticket=?`;
    const vTicketEdit = [
      type,
      price,
      new Date(date_start),
      new Date(date_end),
      id_ticket,
    ];
    const now = new Date();
    const startDate = new Date(date_start);
    const endDate = new Date(date_end);

    if (startDate < now) {
      return res
        .status(401)
        .json({
          status: 401,
          message: "Start time must not be earlier than the current time.",
        });
    } else if (startDate > endDate) {
      return res
        .status(402)
        .json({
          status: 402,
          message: "Finish time must not be earlier than start time.",
        });
    } else {
      connection.query(qTicketEdit, vTicketEdit, (error, rows, result) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ status: 500, message: "Internal Server Error" });
        } else {
          return res
            .status(200)
            .json({ status: 200, message: "Ticket edited successfully" });
        }
      });
    }
  }
};

exports.ticketSetAmount = async (req, res) => {
  const id_ticket = req.params.id_ticket;
  const { amount } = req.body;
  const qValidateAmount = `SELECT sold,amount FROM tickets WHERE id_ticket=?`;
  connection.query(qValidateAmount, id_ticket, async (error, rows, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    } else {
      console.log(id_ticket);
      const vSold = rows[0].sold;
      if (amount < vSold) {
        return res
          .status(400)
          .json({ status: 400, message: "Amount can't be less than sold" });
      } else {
        const qTicketAmount = `UPDATE tickets SET amount=? WHERE id_ticket=?`;
        const vTicketAmount = [amount, id_ticket];
        connection.query(
          qTicketAmount,
          vTicketAmount,
          (error, rows, result) => {
            if (error) {
              console.log(error);
              return res
                .status(500)
                .json({ status: 500, message: "Internal Server Error" });
            } else {
              return res
                .status(200)
                .json({
                  status: 200,
                  message: "Set ticket amount successfully",
                });
            }
          }
        );
      }
    }
  });
};

exports.ticketDelete = async (req, res) => {
  const id_ticket = req.params.id_ticket;
  const vTicketDelete = `DELETE FROM tickets WHERE id_ticket=?`;
  connection.query(vTicketDelete, id_ticket, async (error, rows, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    } else {
      return res
        .status(200)
        .json({ status: 200, message: "Ticket deleted successfully" });
    }
  });
};
