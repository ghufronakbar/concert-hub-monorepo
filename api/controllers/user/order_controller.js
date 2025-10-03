"use strict";

const connection = require("../../connection");
const { midtransCheckout } = require("../../utils/midtrans");

exports.makeOrder = async (req, res) => {
  const id_user = req.decoded.id_user;
  const { id_ticket, amount } = req.body;

  if (!(id_ticket && amount)) {
    return res
      .status(400)
      .json({ status: 400, message: "Field can't be blank" });
  } else {
    const qValidatePayment = `SELECT * FROM histories WHERE datetime > DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND paid=0 AND id_user=?`;
    connection.query(qValidatePayment, id_user, (error, r) => {
      if (error) {
        console.log("Error in qValidatePayment:", error);
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      } else {
        if (r.length > 0) {
          return res.status(400).json({
            status: 400,
            message: "Please pay the previous pending payment",
          });
        } else {
          const qValidateTicket = `SELECT e.id_organization, e.event_name, t.type, t.price, t.amount, t.sold 
                                    FROM tickets AS t JOIN events AS e
                                    WHERE t.id_event = e.id_event 
                                    AND t.id_ticket=?`;
          connection.query(qValidateTicket, id_ticket, async (error, rows) => {
            if (error) {
              console.log("Error in qValidateTicket:", error);
              return res
                .status(500)
                .json({ status: 500, message: "Internal Server Error" });
            } else {
              if (rows.length === 0) {
                return res
                  .status(404)
                  .json({ status: 404, message: "Ticket not found" });
              }

              const validateAmount = rows[0].amount - rows[0].sold;
              const { id_organization, event_name, type, price } = rows[0];
              const random = Math.floor(Math.random() * 100);
              const total = parseInt(price) * parseInt(amount) + random;

              if (amount > validateAmount) {
                return res.status(400).json({
                  status: 400,
                  message: "Can't checkout more than available amount",
                });
              } else {
                let midtransSnapToken = "";
                let midtransRedirectUrl = "";
                const midtransOrderId = `trx-${id_user}-${id_ticket}-${total}`;
                try {
                  const midtransResponse = await midtransCheckout(
                    midtransOrderId,
                    total
                  );
                  console.log(midtransResponse);
                  if (
                    !midtransResponse?.token &&
                    !midtransResponse?.redirect_url
                  ) {
                    return res
                      .status(500)
                      .json({ status: 500, message: "Internal Server Error" });
                  }
                  midtransSnapToken = midtransResponse?.token;
                  midtransRedirectUrl = midtransResponse?.redirect_url;
                } catch (error) {
                  console.log("Error in midtransCheckout:", error);
                  return res
                    .status(500)
                    .json({ status: 500, message: "Internal Server Error" });
                }
                const qInsertHistory = `INSERT INTO histories
                                          (id_organization, id_user, id_ticket, event_name, type_ticket, price, amount, total, datetime, midtrans_order_id, midtrans_snap_token, midtrans_redirect_url)
                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const vInsertHistory = [
                  id_organization,
                  id_user,
                  id_ticket,
                  event_name,
                  type,
                  price,
                  amount,
                  total,
                  new Date(),
                  midtransOrderId,
                  midtransSnapToken,
                  midtransRedirectUrl,
                ];

                connection.query(
                  qInsertHistory,
                  vInsertHistory,
                  (error, result) => {
                    if (error) {
                      console.log("Error in qInsertHistory:", error);
                      return res
                        .status(500)
                        .json({
                          status: 500,
                          message: "Internal Server Error",
                        });
                    } else {
                      if (!result) {
                        console.log("No result from qInsertHistory");
                        return res
                          .status(500)
                          .json({
                            status: 500,
                            message: "Internal Server Error",
                          });
                      }

                      const id_histories = result.insertId;

                      const qSelectSold = `SELECT sold FROM tickets WHERE id_ticket=?`;
                      connection.query(
                        qSelectSold,
                        id_ticket,
                        (error, rows) => {
                          if (error) {
                            console.log("Error in qSelectSold:", error);
                            return res
                              .status(500)
                              .json({
                                status: 500,
                                message: "Internal Server Error",
                              });
                          } else {
                            if (rows.length === 0) {
                              return res
                                .status(404)
                                .json({
                                  status: 404,
                                  message: "Ticket not found",
                                });
                            }

                            const currentSold = rows[0].sold;
                            const updateSold =
                              parseInt(currentSold) + parseInt(amount);
                            const qUpdateSold = `UPDATE tickets SET sold=? WHERE id_ticket=?`;
                            connection.query(
                              qUpdateSold,
                              [updateSold, id_ticket],
                              (error) => {
                                if (error) {
                                  console.log("Error in qUpdateSold:", error);
                                  return res
                                    .status(500)
                                    .json({
                                      status: 500,
                                      message: "Internal Server Error",
                                    });
                                } else {
                                  return res.status(200).json({
                                    status: 200,
                                    id_histories: id_histories,
                                    midtrans_order_id: midtransOrderId,
                                    midtrans_snap_token: midtransSnapToken,
                                    midtrans_redirect_url: midtransRedirectUrl,
                                    message: `Order success, please pay Rp ${total} before 10 minutes!`,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          });
        }
      }
    });
  }
};

exports.cancelOrder = async (req, res) => {
  const id_user = req.decoded.id_user;
  const id_history = req.params.id_history;

  const qGetAmountIdTicket = `SELECT amount,id_ticket FROM histories WHERE id_history=?`;
  connection.query(qGetAmountIdTicket, id_history, (error, rows, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    } else {
      const { amount, id_ticket } = rows[0];
      const qGetSold = `SELECT sold FROM tickets WHERE id_ticket=?`;
      connection.query(qGetSold, id_ticket, (error, rows, result) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ status: 500, message: "Internal Server Error" });
        } else {
          const { sold } = rows[0];
          const updateSold = parseInt(sold) - parseInt(amount);
          const qUpdateSold = `UPDATE tickets SET sold=? WHERE id_ticket=?`;
          connection.query(
            qUpdateSold,
            [updateSold, id_ticket],
            (error, rows, result) => {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .json({ status: 500, message: "Internal Server Error" });
              } else {
                const qCancelOrder = `UPDATE histories SET paid=1 WHERE id_history=? AND id_user=?`;
                connection.query(
                  qCancelOrder,
                  [id_history, id_user],
                  (error, rows, result) => {
                    if (error) {
                      console.log(error);
                      return res.status(500).json({
                        status: 500,
                        message: "Internal Server Error",
                      });
                    } else {
                      return res
                        .status(200)
                        .json({ status: 200, message: `Cancel order success` });
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  });
};

exports.confirmOrder = async (req, res) => {
  const id_user = req.decoded.id_user;
  const id_history = req.params.id_history;

  // Query to get all relevant entries
  const qGetEntries = `
        SELECT h.*, t.id_event, t.sold,t.amount AS ticket_amount
        FROM histories AS h 
        JOIN tickets AS t ON h.id_ticket = t.id_ticket 
        WHERE h.id_user = ? AND h.id_history = ?`;

  connection.query(qGetEntries, [id_user, id_history], (error, rows) => {
    if (error) {
      console.error("Database query error:", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "No matching records found" });
    }

    const {
      id_history,
      id_user,
      id_event,
      id_ticket,
      amount,
      datetime,
      sold,
      ticket_amount,
      id_organization,
    } = rows[0];

    // Convert datetime from database to JavaScript Date object
    const dbDatetime = new Date(datetime);

    // Add 10 minutes to the datetime
    const tenMinutesAfterDbDatetime = new Date(
      dbDatetime.getTime() + 10 * 60000
    );

    // Current time
    const now = new Date();

    // Compare times
    if (now > tenMinutesAfterDbDatetime) {
      return res
        .status(400)
        .json({ status: 400, message: "Payment time has expired" });
    }

    // Format datetime to YYYY-MM-DD
    const formattedDatetime = dbDatetime.toISOString().split("T")[0];

    const unique_code = `${id_history}/${id_user}/${id_organization}/${id_event}/${id_ticket}/${amount}/${formattedDatetime}`;

    const qConfirmOrder = `
            UPDATE histories 
            SET paid = 3 
            WHERE id_history = ? 
              AND id_user = ?`;

    const vConfirmOrder = [id_history, id_user];

    connection.query(qConfirmOrder, vConfirmOrder, (error, result) => {
      if (error) {
        console.error("Database update error:", error);
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
      return res.status(200).json({
        status: 200,
        message: `Confirm order success, please wait for confirmation`,
      });
    });
  });
};
