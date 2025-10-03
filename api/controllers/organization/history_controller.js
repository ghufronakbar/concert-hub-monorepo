'use strict';

const connection = require('../../connection');

exports.showHistory = async (req, res) => {
    const id_organization = req.decoded.id_organization;
    const { paid } = req.query;

    // Membuat bagian dari query tergantung apakah 'paid' disediakan atau tidak
    const queryPaid = paid !== undefined ? ` AND h.paid=${paid}` : "";

    // Query untuk mendapatkan histories yang perlu diperbarui
    const qSelectTimeOut = `
        SELECT id_history, amount, id_ticket 
        FROM histories 
        WHERE datetime < DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND paid=0 AND id_organization=?`;

    connection.query(qSelectTimeOut, [id_organization], (error, rows) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: "Internal Server Error" });
        }

        if (rows.length > 0) {
            const historyIds = rows.map(row => row.id_history);
            const ticketUpdates = rows.map(row => ({
                id_ticket: row.id_ticket,
                amount: row.amount
            }));

            // Batch update untuk histories
            const qUpdatePaid = `UPDATE histories SET paid=5 WHERE id_history IN (?)`;
            connection.query(qUpdatePaid, [historyIds], (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                }

                // Batch update untuk tickets
                const qUpdateTickets = `
                    UPDATE tickets 
                    SET sold = sold - ? 
                    WHERE id_ticket = ?`;

                const updateTasks = ticketUpdates.map(ticket => {
                    return new Promise((resolve, reject) => {
                        connection.query(qUpdateTickets, [ticket.amount, ticket.id_ticket], (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(updateTasks)
                    .then(() => {
                        // Query untuk menampilkan history
                        const qShowHistory = `
                            SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                                   h.total, h.unique_code, h.paid, h.used, h.datetime,
                                   u.fullname, u.email, u.phone
                            FROM histories AS h 
                            JOIN users AS u ON h.id_user = u.id_user
                            WHERE h.id_organization=?${queryPaid}`;

                        connection.query(qShowHistory, [id_organization], (error, rows) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ status: 500, message: "Internal Server Error" });
                            }
                            return res.status(200).json(rows);
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                    });
            });
        } else {
            // Jika tidak ada history yang perlu diperbarui, langsung tampilkan history
            const qShowHistory = `
                SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                       h.total, h.unique_code, h.paid, h.used, h.datetime,
                       u.fullname, u.email, u.phone
                FROM histories AS h 
                JOIN users AS u ON h.id_user = u.id_user
                WHERE h.id_organization=?${queryPaid}`;

            connection.query(qShowHistory, [id_organization], (error, rows) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                }
                return res.status(200).json(rows);
            });
        }
    });
};

exports.showHistoryId = async (req, res) => {
    const id_organization = req.decoded.id_organization;
    const { id_history } = req.params;

    // Query untuk mendapatkan histories yang perlu diperbarui
    const qSelectTimeOut = `
        SELECT id_history, amount, id_ticket 
        FROM histories 
        WHERE datetime < DATE_SUB(NOW(), INTERVAL 10 MINUTE) AND paid=0 AND id_organization=? AND id_history=?`;

    connection.query(qSelectTimeOut, [id_organization, id_history], (error, rows) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: "Internal Server Error" });
        }

        if (rows.length > 0) {
            const historyIds = rows.map(row => row.id_history);
            const ticketUpdates = rows.map(row => ({
                id_ticket: row.id_ticket,
                amount: row.amount
            }));

            // Batch update untuk histories
            const qUpdatePaid = `UPDATE histories SET paid=5 WHERE id_history IN (?)`;
            connection.query(qUpdatePaid, [historyIds], (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                }

                // Batch update untuk tickets
                const qUpdateTickets = `
                    UPDATE tickets 
                    SET sold = sold - ? 
                    WHERE id_ticket = ?`;

                const updateTasks = ticketUpdates.map(ticket => {
                    return new Promise((resolve, reject) => {
                        connection.query(qUpdateTickets, [ticket.amount, ticket.id_ticket], (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(updateTasks)
                    .then(() => {
                        // Query untuk menampilkan history berdasarkan id_history
                        const qShowHistory = `
                            SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                                   h.total, h.unique_code, h.paid, h.used, h.datetime,
                                   u.fullname, u.email, u.phone
                            FROM histories AS h 
                            JOIN users AS u ON h.id_user = u.id_user
                            WHERE h.id_organization=? AND h.id_history=?`;

                        connection.query(qShowHistory, [id_organization, id_history], (error, rows) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ status: 500, message: "Internal Server Error" });
                            }
                            return res.status(200).json(rows);
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                    });
            });
        } else {
            // Jika tidak ada history yang perlu diperbarui, langsung tampilkan history
            const qShowHistory = `
                SELECT h.id_history, h.event_name, h.type_ticket, h.price, h.amount,
                       h.total, h.unique_code, h.paid, h.used, h.datetime,
                       u.fullname, u.email, u.phone
                FROM histories AS h 
                JOIN users AS u ON h.id_user = u.id_user
                WHERE h.id_organization=? AND h.id_history=?`;

            connection.query(qShowHistory, [id_organization, id_history], (error, rows) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                }
                return res.status(200).json(rows);
            });
        }
    });
};
