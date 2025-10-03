'use strict';

const connection = require('../../connection');

exports.handleConfirm = async (req, res) => {
    const { id_history } = req.params

    const qGetEntries = `
    SELECT h.*, t.id_event, t.sold,t.amount AS ticket_amount
    FROM histories AS h 
    LEFT JOIN tickets AS t ON h.id_ticket = t.id_ticket 
    WHERE h.id_history = ?`;

    console.log({ id_history })
    connection.query(qGetEntries, id_history,
        (error, rows, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                if (rows.length == 0) {
                    return res.status(400).json({ status: 400, message: "Order Not Found" })
                }
                const { id_history, id_user, id_event, id_ticket, amount, datetime, sold, ticket_amount, id_organization } = rows[0];

                const formattedDatetime = datetime.toISOString().split('T')[0];

                const unique_code = `${id_history}/${id_user}/${id_organization}/${id_event}/${id_ticket}/${amount}/${formattedDatetime}`;

                const qHandleConfirm = `UPDATE histories SET paid=4, unique_code=? WHERE id_history=?`

                connection.query(qHandleConfirm, [unique_code, id_history],
                    (error, rows, result) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ status: 500, message: "Internal Server Error" });
                        } else {
                            return res.status(200).json({ status: 200, message: "Order confirmed" });
                        }
                    }
                )

            }
        }
    )


}

exports.handleAnomaly = async (req, res) => {
    const { id_history } = req.params
    const qHandleConfirm = `UPDATE histories SET paid=2 WHERE id_history=?`
    connection.query(qHandleConfirm, id_history,
        (error, rows, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                const qGetAmount = `SELECT amount,id_ticket FROM histories WHERE id_history=?`
                connection.query(qGetAmount, id_history,
                    (error, rows, result) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ status: 500, message: "Internal Server Error" });
                        } else {
                            const amount = rows[0].amount
                            const index_ticket = rows[0].id_ticket
                            const qGetSold = `SELECT sold FROM tickets WHERE id_ticket=?`
                            connection.query(qGetSold, index_ticket,
                                (error, rows, result) => {
                                    if (error) {
                                        console.log(error);
                                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                                    } else {
                                        if (rows.length === 0) {
                                            return res.status(200).json({ status: 200, message: "Cancel order successfully, but the ticket may have been deleted" });
                                        }
                                        const sold = rows[0].sold
                                        const setSold = sold - amount
                                        const qUpdateSold = `UPDATE tickets SET sold=? WHERE id_ticket=?`
                                        connection.query(qUpdateSold, [setSold, index_ticket],
                                            (error, rows, result) => {
                                                if (error) {
                                                    console.log(error);
                                                    return res.status(204).json({ status: 204, message: "Cancel order successfully but the ticket may has been deleted" });
                                                } else {
                                                    return res.status(200).json({ status: 200, message: "Cancel order successfully" });
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    }
                )
            }
        }
    )
}


exports.handleScanTicket = async (req, res) => {
    const id_organization = req.decoded.id_organization
    const { unique_code } = req.body
    const decoded_uc = unique_code.split("/")

    if (decoded_uc.length != 7) {
        return res.status(400).json({ status: 400, message: "Invalid unique code" });
    } else {
        const dIdHistory = decoded_uc[0]
        const dIdUser = decoded_uc[1]
        const dIdOrganization = decoded_uc[2]
        const dIdEvent = decoded_uc[3]
        const dIdTicket = decoded_uc[4]
        const dAmount = decoded_uc[5]
        const dDate = decoded_uc[6]

        const qCodeIsExist = `SELECT * FROM histories WHERE id_history=?`
        connection.query(qCodeIsExist, dIdHistory,
            (error, rows, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                } else {
                    if (rows.length == 0) {
                        return res.status(400).json({ status: 400, message: "There's no order exist" });
                    }
                    const vIdOrganization = rows[0].id_organization
                    const vUsed = rows[0].used
                    const vPaid = rows[0].paid
                    const vUniqueCode = rows[0].unique_code
                    if (vUniqueCode != unique_code) {
                        return res.status(400).json({ status: 400, message: "There's no unique code exist" });
                    } else if (dIdOrganization != id_organization) {
                        return res.status(400).json({ status: 400, message: "You are not allowed to scan tickets that are not your event" });
                    } else if (dIdOrganization == vIdOrganization) {
                        if (vPaid != 4) {
                            return res.status(400).json({ status: 400, message: "Tickets have not been paid for and confirmed" });
                        } else if (vPaid == 4) {
                            if (vUsed == 1) {
                                return res.status(400).json({ status: 400, message: "Tickets have already been used" });
                            } else if (vUsed != 1) {
                                const qSetUsed = `UPDATE histories SET used=1 WHERE id_history=?`
                                connection.query(qSetUsed, dIdHistory,
                                    (error, rows, result) => {
                                        if (error) {
                                            console.log(error);
                                            return res.status(500).json({ status: 500, message: "Internal Server Error" });
                                        } else {
                                            return res.status(200).json({ status: 200, message: "Ticket successfully scanned" });
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            }
        )
    }
}