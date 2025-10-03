"use strict";

const connection = require("../../connection");
const { midtransCheck } = require("../../utils/midtrans");

exports.showHistory = async (req, res) => {
  const id_user = req.decoded.id_user;
  const { paid } = req.query;

  // Membuat bagian dari query tergantung apakah 'paid' disediakan atau tidak
  const queryPaid = paid !== undefined ? ` AND h.paid=${paid}` : "";
  // Query untuk mendapatkan histories yang perlu diperbarui
  const qSelectTimeOut = `
        SELECT id_history, amount, id_ticket 
        FROM histories 
        WHERE datetime < DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND paid=0`;

  connection.query(qSelectTimeOut, (error, rows) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }

    if (rows.length > 0) {
      const historyIds = rows.map((row) => row.id_history);
      const ticketUpdates = rows.map((row) => ({
        id_ticket: row.id_ticket,
        amount: row.amount,
      }));

      // Batch update untuk histories
      const qUpdatePaid = `UPDATE histories SET paid=5 WHERE id_history IN (?)`;
      connection.query(qUpdatePaid, [historyIds], (error) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ status: 500, message: "Internal Server Error" });
        }

        // Batch update untuk tickets
        const qUpdateTickets = `
                    UPDATE tickets 
                    SET sold = sold - ? 
                    WHERE id_ticket = ?`;

        const updateTasks = ticketUpdates.map((ticket) => {
          return new Promise((resolve, reject) => {
            connection.query(
              qUpdateTickets,
              [ticket.amount, ticket.id_ticket],
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              }
            );
          });
        });

        Promise.all(updateTasks)
          .then(() => {
            // Query untuk menampilkan history
            const qShowHistory = `
                            SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                                   h.total, h.unique_code, h.paid, h.used, h.datetime, h.midtrans_order_id, h.midtrans_snap_token, h.midtrans_redirect_url,
                                   u.fullname, u.email, u.phone
                            FROM histories AS h 
                            JOIN users AS u ON h.id_user = u.id_user
                            WHERE h.id_user=?${queryPaid}`;

            connection.query(qShowHistory, [id_user], (error, rows) => {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .json({ status: 500, message: "Internal Server Error" });
              }
              return res.status(200).json(rows);
            });
          })
          .catch((error) => {
            console.log(error);
            return res
              .status(500)
              .json({ status: 500, message: "Internal Server Error" });
          });
      });
    } else {
      // Jika tidak ada history yang perlu diperbarui, langsung tampilkan history
      const qShowHistory = `
                SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                       h.total, h.unique_code, h.paid, h.used, h.datetime, h.midtrans_order_id, h.midtrans_snap_token, h.midtrans_redirect_url,
                       u.fullname, u.email, u.phone
                FROM histories AS h 
                JOIN users AS u ON h.id_user = u.id_user
                WHERE h.id_user=?${queryPaid}`;

      connection.query(qShowHistory, [id_user], (error, rows) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ status: 500, message: "Internal Server Error" });
        }
        return res.status(200).json(rows);
      });
    }
  });
};

exports.showHistoryId = async (req, res) => {
  const id_user = req.decoded.id_user;
  const { id_history } = req.params;

  // SELECT CUR HISTORY FIRST
  connection.query(
    `
    SELECT h.*, t.id_event 
    FROM histories h
    JOIN tickets t ON h.id_ticket = t.id_ticket
    WHERE h.id_history = ?;
    `,
    [id_history],
    async (error, rows) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "History not found" });
      }
      const {
        midtrans_order_id,
        midtrans_snap_token,
        midtrans_redirect_url,
        paid,
      } = rows[0];
      if (
        midtrans_order_id &&
        midtrans_snap_token &&
        midtrans_redirect_url &&
        paid === 0
      ) {
        let midtransResponse = null;
        try {
          midtransResponse = await midtransCheck(midtrans_order_id);
        } catch (error) {}
        if (
          midtransResponse &&
          midtransResponse?.status_code === "200" &&
          midtransResponse?.transaction_status === "settlement"
        ) {
          const { datetime, id_organization, id_event, id_ticket, amount } = rows[0];
          const formattedDatetime = datetime.toISOString().split('T')[0];
          const unique_code = `${id_history}/${id_user}/${id_organization}/${id_event}/${id_ticket}/${amount}/${formattedDatetime}`;
          connection.query(
            "UPDATE histories SET paid=4, unique_code=? WHERE id_history=?",
            [unique_code, id_history],
            (error) => {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .json({ status: 500, message: "Internal Server Error" });
              }
              // NEXT LOGIC HERE
              const qSelectTimeOut = `
        SELECT id_history, amount, id_ticket 
        FROM histories 
        WHERE datetime < DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND paid=0`;

              connection.query(qSelectTimeOut, (error, rows) => {
                if (error) {
                  console.log(error);
                  return res
                    .status(500)
                    .json({ status: 500, message: "Internal Server Error" });
                }

                if (rows.length > 0) {
                  const historyIds = rows.map((row) => row.id_history);
                  const ticketUpdates = rows.map((row) => ({
                    id_ticket: row.id_ticket,
                    amount: row.amount,
                  }));

                  // Batch update untuk histories
                  const qUpdatePaid = `UPDATE histories SET paid=5 WHERE id_history IN (?)`;
                  connection.query(qUpdatePaid, [historyIds], (error) => {
                    if (error) {
                      console.log(error);
                      return res.status(500).json({
                        status: 500,
                        message: "Internal Server Error",
                      });
                    }

                    // Batch update untuk tickets
                    const qUpdateTickets = `
                    UPDATE tickets 
                    SET sold = sold - ? 
                    WHERE id_ticket = ?`;
                    const updateTasks = ticketUpdates.map((ticket) => {
                      return new Promise((resolve, reject) => {
                        connection.query(
                          qUpdateTickets,
                          [ticket.amount, ticket.id_ticket],
                          (error) => {
                            if (error) {
                              reject(error);
                            } else {
                              resolve();
                            }
                          }
                        );
                      });
                    });

                    Promise.all(updateTasks)
                      .then(() => {
                        // Query untuk menampilkan history
                        const qShowHistory = `
                        SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                       h.total, h.unique_code, h.paid, h.used, h.datetime, h.midtrans_order_id, h.midtrans_snap_token, h.midtrans_redirect_url,
                       u.fullname, u.email, u.phone
                FROM histories AS h 
                JOIN users AS u ON h.id_user = u.id_user
                JOIN tickets AS t ON h.id_ticket = t.id_ticket
                JOIN events AS e ON t.id_event = e.id_event
                WHERE h.id_user=? AND h.id_history=?`;

                        connection.query(
                          qShowHistory,
                          [id_user, id_history],
                          (error, rows) => {
                            if (error) {
                              console.log(error);
                              return res.status(500).json({
                                status: 500,
                                message: "Internal Server Error",
                              });
                            }
                            return res.status(200).json(rows[0]);
                          }
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                        return res.status(500).json({
                          status: 500,
                          message: "Internal Server Error",
                        });
                      });
                  });
                } else {
                  // Jika tidak ada history yang perlu diperbarui, langsung tampilkan history

                  const qShowHistory = `
                            SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                            h.total, h.unique_code, h.paid, h.used, h.datetime, h.midtrans_order_id, h.midtrans_snap_token, h.midtrans_redirect_url,
                            u.fullname, u.email, u.phone
                            FROM histories AS h 
                            LEFT JOIN users AS u ON h.id_user = u.id_user
                            LEFT JOIN tickets AS t ON h.id_ticket = t.id_ticket
                            LEFT JOIN events AS e ON t.id_event = e.id_event
                            WHERE h.id_user=? AND h.id_history=?`;

                  connection.query(
                    qShowHistory,
                    [id_user, id_history],
                    (error, rows) => {
                      if (error) {
                        console.log(error);
                        return res.status(500).json({
                          status: 500,
                          message: "Internal Server Error",
                        });
                      }
                      return res.status(200).json(rows[0]);
                    }
                  );
                }
              });
            }
          );
        } else {
          // NEXT LOGIC HERE
          const qSelectTimeOut = `
        SELECT id_history, amount, id_ticket 
        FROM histories 
        WHERE datetime < DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND paid=0`;

          connection.query(qSelectTimeOut, (error, rows) => {
            if (error) {
              console.log(error);
              return res
                .status(500)
                .json({ status: 500, message: "Internal Server Error" });
            }

            if (rows.length > 0) {
              const historyIds = rows.map((row) => row.id_history);
              const ticketUpdates = rows.map((row) => ({
                id_ticket: row.id_ticket,
                amount: row.amount,
              }));

              // Batch update untuk histories
              const qUpdatePaid = `UPDATE histories SET paid=5 WHERE id_history IN (?)`;
              connection.query(qUpdatePaid, [historyIds], (error) => {
                if (error) {
                  console.log(error);
                  return res
                    .status(500)
                    .json({ status: 500, message: "Internal Server Error" });
                }

                // Batch update untuk tickets
                const qUpdateTickets = `
                    UPDATE tickets 
                    SET sold = sold - ? 
                    WHERE id_ticket = ?`;
                const updateTasks = ticketUpdates.map((ticket) => {
                  return new Promise((resolve, reject) => {
                    connection.query(
                      qUpdateTickets,
                      [ticket.amount, ticket.id_ticket],
                      (error) => {
                        if (error) {
                          reject(error);
                        } else {
                          resolve();
                        }
                      }
                    );
                  });
                });

                Promise.all(updateTasks)
                  .then(() => {
                    // Query untuk menampilkan history
                    const qShowHistory = `
                        SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                       h.total, h.unique_code, h.paid, h.used, h.datetime, h.midtrans_order_id, h.midtrans_snap_token, h.midtrans_redirect_url,
                       u.fullname, u.email, u.phone
                FROM histories AS h 
                JOIN users AS u ON h.id_user = u.id_user
                JOIN tickets AS t ON h.id_ticket = t.id_ticket
                JOIN events AS e ON t.id_event = e.id_event
                WHERE h.id_user=? AND h.id_history=?`;

                    connection.query(
                      qShowHistory,
                      [id_user, id_history],
                      (error, rows) => {
                        if (error) {
                          console.log(error);
                          return res.status(500).json({
                            status: 500,
                            message: "Internal Server Error",
                          });
                        }
                        return res.status(200).json(rows[0]);
                      }
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    return res
                      .status(500)
                      .json({ status: 500, message: "Internal Server Error" });
                  });
              });
            } else {
              // Jika tidak ada history yang perlu diperbarui, langsung tampilkan history

              const qShowHistory = `
                            SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                            h.total, h.unique_code, h.paid, h.used, h.datetime, h.midtrans_order_id, h.midtrans_snap_token, h.midtrans_redirect_url,
                            u.fullname, u.email, u.phone
                            FROM histories AS h 
                            LEFT JOIN users AS u ON h.id_user = u.id_user
                            LEFT JOIN tickets AS t ON h.id_ticket = t.id_ticket
                            LEFT JOIN events AS e ON t.id_event = e.id_event
                            WHERE h.id_user=? AND h.id_history=?`;

              connection.query(
                qShowHistory,
                [id_user, id_history],
                (error, rows) => {
                  if (error) {
                    console.log(error);
                    return res
                      .status(500)
                      .json({ status: 500, message: "Internal Server Error" });
                  }
                  return res.status(200).json(rows[0]);
                }
              );
            }
          });
        }
      } else {
        // NEXT LOGIC HERE
        const qSelectTimeOut = `
        SELECT id_history, amount, id_ticket 
        FROM histories 
        WHERE datetime < DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND paid=0`;

        connection.query(qSelectTimeOut, (error, rows) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ status: 500, message: "Internal Server Error" });
          }

          if (rows.length > 0) {
            const historyIds = rows.map((row) => row.id_history);
            const ticketUpdates = rows.map((row) => ({
              id_ticket: row.id_ticket,
              amount: row.amount,
            }));

            // Batch update untuk histories
            const qUpdatePaid = `UPDATE histories SET paid=5 WHERE id_history IN (?)`;
            connection.query(qUpdatePaid, [historyIds], (error) => {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .json({ status: 500, message: "Internal Server Error" });
              }

              // Batch update untuk tickets
              const qUpdateTickets = `
                    UPDATE tickets 
                    SET sold = sold - ? 
                    WHERE id_ticket = ?`;
              const updateTasks = ticketUpdates.map((ticket) => {
                return new Promise((resolve, reject) => {
                  connection.query(
                    qUpdateTickets,
                    [ticket.amount, ticket.id_ticket],
                    (error) => {
                      if (error) {
                        reject(error);
                      } else {
                        resolve();
                      }
                    }
                  );
                });
              });

              Promise.all(updateTasks)
                .then(() => {
                  // Query untuk menampilkan history
                  const qShowHistory = `
                        SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                       h.total, h.unique_code, h.paid, h.used, h.datetime, h.midtrans_order_id, h.midtrans_snap_token, h.midtrans_redirect_url,
                       u.fullname, u.email, u.phone
                FROM histories AS h 
                JOIN users AS u ON h.id_user = u.id_user
                JOIN tickets AS t ON h.id_ticket = t.id_ticket
                JOIN events AS e ON t.id_event = e.id_event
                WHERE h.id_user=? AND h.id_history=?`;

                  connection.query(
                    qShowHistory,
                    [id_user, id_history],
                    (error, rows) => {
                      if (error) {
                        console.log(error);
                        return res.status(500).json({
                          status: 500,
                          message: "Internal Server Error",
                        });
                      }
                      return res.status(200).json(rows[0]);
                    }
                  );
                })
                .catch((error) => {
                  console.log(error);
                  return res
                    .status(500)
                    .json({ status: 500, message: "Internal Server Error" });
                });
            });
          } else {
            // Jika tidak ada history yang perlu diperbarui, langsung tampilkan history

            const qShowHistory = `
                            SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                            h.total, h.unique_code, h.paid, h.used, h.datetime, h.midtrans_order_id, h.midtrans_snap_token, h.midtrans_redirect_url,
                            u.fullname, u.email, u.phone
                            FROM histories AS h 
                            LEFT JOIN users AS u ON h.id_user = u.id_user
                            LEFT JOIN tickets AS t ON h.id_ticket = t.id_ticket
                            LEFT JOIN events AS e ON t.id_event = e.id_event
                            WHERE h.id_user=? AND h.id_history=?`;

            connection.query(
              qShowHistory,
              [id_user, id_history],
              (error, rows) => {
                if (error) {
                  console.log(error);
                  return res
                    .status(500)
                    .json({ status: 500, message: "Internal Server Error" });
                }
                return res.status(200).json(rows[0]);
              }
            );
          }
        });
      }
    }
  );
};
