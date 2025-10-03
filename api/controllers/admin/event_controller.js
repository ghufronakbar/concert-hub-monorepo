'use strict';

const connection = require('../../connection');

exports.eventShow = async (req, res) => {

    const { time, status } = req.query;

    let conditions = [];

    if (time) {
        if (time === "past") {
            conditions.push("e.event_end < CURDATE()");
        } else if (time === "on-going") {
            conditions.push("e.event_start < CURDATE() AND e.event_end > CURDATE()");
        } else if (time === "soon") {
            conditions.push("e.event_start > CURDATE()");
        }
    }

    if (status !== undefined) {
        if (status == 0) {
            conditions.push("e.status = 0");
        } else if (status == 1) {
            conditions.push("e.status = 1");
        } else if (status == 2) {
            conditions.push("e.status = 2");
        }
    }

    let queryWhere = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const qEventShow = `
  SELECT e.id_event, e.id_organization, o.organization_name, e.event_name, e.description, e.location,
         e.event_image, e.site_plan_image, e.type AS event_type, e.status,
         e.event_start, e.event_end, e.created_at, t.id_ticket, t.type AS ticket_type,
         t.amount, t.sold, t.price, t.date_start, t.date_end
  FROM events AS e 
  LEFT JOIN tickets AS t ON e.id_event = t.id_event
  LEFT JOIN organizations AS o ON e.id_organization = o.id_organization
  ${queryWhere}
`;

    connection.query(qEventShow, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            // Process the rows to create the desired output format
            const events = {};

            rows.forEach(row => {
                const eventId = row.id_event;

                const now = new Date();
                const eventStart = new Date(row.event_start);
                const eventEnd = new Date(row.event_end);
                let event_status = "";
                let base_url_google_map = "https://google.com/maps?q="
                let url_google_map = ""
                if(row.id_event){
                    let query_google_map = row.location.split(" ").join("+")
                    url_google_map = base_url_google_map + query_google_map;
                }


                if (now > eventEnd) {
                    event_status = "Past";
                } else if (now < eventStart) {
                    event_status = "Soon";
                } else if (now >= eventStart && now <= eventEnd) {
                    event_status = "On Going";
                }

                if (!events[eventId]) {
                    events[eventId] = {
                        id_event: row.id_event,
                        id_organization: row.id_organization,
                        organization_name: row.organization_name,
                        event_name: row.event_name,
                        description: row.description,
                        location: row.location,
                        event_image: row.event_image ? process.env.BASE_URL + `/images/event/` + row.event_image : null,
                        site_plan_image: row.site_plan_image ? process.env.BASE_URL + `/images/site-plan/` + row.site_plan_image : null,
                        url_google_map,
                        event_type: row.event_type,
                        status: row.status,
                        event_start: row.event_start,
                        event_end: row.event_end,
                        event_status,
                        created_at: row.created_at,
                        total_type: 0,
                        total_ticket: 0,
                        total_sold: 0,
                        tickets: []
                    };
                }

                if (row.id_ticket) {
                    events[eventId].tickets.push({
                        id_ticket: row.id_ticket,
                        ticket_type: row.ticket_type,
                        amount: row.amount,
                        sold: row.sold,
                        price: row.price,
                        date_start: row.date_start,
                        date_end: row.date_end
                    });

                    events[eventId].total_type += 1;
                    events[eventId].total_ticket += row.amount;
                    events[eventId].total_sold += row.sold;
                }
            });

            const result = Object.values(events);
            res.json(result);
        }
    });
};



exports.eventShowId = async (req, res) => {
    const { id_event } = req.params
    const qEventShowId = `
        SELECT e.id_event, e.id_organization, o.organization_name, e.event_name, e.description, e.location,
               e.event_image, e.site_plan_image, e.type AS event_type, e.status,
               e.event_start, e.event_end, e.created_at, t.id_ticket, t.type AS ticket_type,
               t.amount, t.sold, t.price, t.date_start, t.date_end
        FROM events AS e 
        LEFT JOIN tickets AS t ON e.id_event = t.id_event
        LEFT JOIN organizations AS o ON e.id_organization = o.id_organization
        WHERE e.id_event=?
    `;

    connection.query(qEventShowId, id_event, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            // Process the rows to create the desired output format
            const events = {};

            rows.forEach(row => {
                const eventId = row.id_event;

                let base_url_google_map = "https://google.com/maps?q="
                let url_google_map = ""
                if(row.id_event){
                    let query_google_map = row.location.split(" ").join("+")
                    url_google_map = base_url_google_map + query_google_map;
                }

                if (!events[eventId]) {
                    events[eventId] = {
                        id_event: row.id_event,
                        id_organization: row.id_organization,
                        organization_name: row.organization_name,
                        event_name: row.event_name,
                        description: row.description,
                        location: row.location,
                        url_google_map,
                        event_image: row.event_image,
                        event_image: row.event_image ? process.env.BASE_URL + `/images/event/` + row.event_image : null,
                        site_plan_image: row.site_plan_image ? process.env.BASE_URL + `/images/site-plan/` + row.site_plan_image : null,
                        event_type: row.event_type,
                        status: row.status,
                        event_start: row.event_start,
                        event_end: row.event_end,
                        created_at: row.created_at,
                        total_type: 0,
                        total_ticket: 0,
                        total_sold: 0,
                        tickets: []
                    };
                }

                if (row.id_ticket) {
                    events[eventId].tickets.push({
                        id_ticket: row.id_ticket,
                        ticket_type: row.ticket_type,
                        amount: row.amount,
                        sold: row.sold,
                        price: row.price,
                        date_start: row.date_start,
                        date_end: row.date_end
                    });

                    events[eventId].total_type += 1;
                    events[eventId].total_ticket += row.amount;
                    events[eventId].total_sold += row.sold;
                }
            });

            const result = Object.values(events);

            res.json(result);
        }
    });
};


exports.eventReject = async (req, res) => {
    const { id_event } = req.params
    const qEventReject = `UPDATE events SET status=1 WHERE id_event=?`

    connection.query(qEventReject, id_event,
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                res.status(200).json({ status: 200, message: "Event has been rejected" });
            }
        }
    )
}

exports.eventApprove = async (req, res) => {
    const { id_event } = req.params
    const qEventApprove = `UPDATE events SET status=2 WHERE id_event=?`

    connection.query(qEventApprove, id_event,
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                res.status(200).json({ status: 200, message: "Event has been approved" });
            }
        }
    )
}

exports.eventPast = async (req, res) => {
    const qEventPast = `
        SELECT e.id_event, e.id_organization, o.organization_name, e.event_name, e.description, e.location,
               e.event_image, e.site_plan_image, e.type AS event_type, e.status,
               e.event_start, e.event_end, e.created_at, t.id_ticket, t.type AS ticket_type,
               t.amount, t.sold, t.price, t.date_start, t.date_end
        FROM events AS e 
        LEFT JOIN tickets AS t ON e.id_event = t.id_event
        LEFT JOIN organizations AS o ON e.id_organization = o.id_organization
        WHERE e.event_end < CURDATE()
    `;

    connection.query(qEventPast, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            // Process the rows to create the desired output format
            const events = {};

            rows.forEach(row => {
                const eventId = row.id_event;

                if (!events[eventId]) {
                    events[eventId] = {
                        id_event: row.id_event,
                        id_organization: row.id_organization,
                        organization_name: row.organization_name,
                        event_name: row.event_name,
                        description: row.description,
                        location: row.location,
                        event_image: row.event_image,
                        event_image: row.event_image ? process.env.BASE_URL + `/images/event/` + row.event_image : null,
                        site_plan_image: row.site_plan_image ? process.env.BASE_URL + `/images/site-plan/` + row.site_plan_image : null,
                        status: row.status,
                        event_start: row.event_start,
                        event_end: row.event_end,
                        created_at: row.created_at,
                        total_type: 0,
                        total_ticket: 0,
                        total_sold: 0,
                        tickets: []
                    };
                }

                if (row.id_ticket) {
                    events[eventId].tickets.push({
                        id_ticket: row.id_ticket,
                        ticket_type: row.ticket_type,
                        amount: row.amount,
                        sold: row.sold,
                        price: row.price,
                        date_start: row.date_start,
                        date_end: row.date_end
                    });

                    events[eventId].total_type += 1;
                    events[eventId].total_ticket += row.amount;
                    events[eventId].total_sold += row.sold;
                }
            });

            const result = Object.values(events);

            res.json(result);
        }
    });
};



exports.eventSoon = async (req, res) => {
    const qEventSoon = `
        SELECT e.id_event, e.id_organization, o.organization_name, e.event_name, e.description, e.location,
               e.event_image, e.site_plan_image, e.type AS event_type, e.status,
               e.event_start, e.event_end, e.created_at, t.id_ticket, t.type AS ticket_type,
               t.amount, t.sold, t.price, t.date_start, t.date_end
        FROM events AS e 
        LEFT JOIN tickets AS t ON e.id_event = t.id_event
        LEFT JOIN organizations AS o ON e.id_organization = o.id_organization
        WHERE e.event_start > CURDATE() 
    `;

    connection.query(qEventSoon, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            // Process the rows to create the desired output format
            const events = {};

            rows.forEach(row => {
                const eventId = row.id_event;

                const now = new Date();
                const eventStart = new Date(row.event_start);
                const eventEnd = new Date(row.event_end);
                let event_status = "";
                let base_url_google_map = "https://google.com/maps?q="
                let query_google_map = row.location.split(" ").join("+")
                const url_google_map = base_url_google_map + query_google_map;


                if (now > eventEnd) {
                    event_status = "Past";
                } else if (now < eventStart) {
                    event_status = "Soon";
                } else if (now >= eventStart && now <= eventEnd) {
                    event_status = "On Going";
                }

                if (!events[eventId]) {
                    events[eventId] = {
                        id_event: row.id_event,
                        id_organization: row.id_organization,
                        organization_name: row.organization_name,
                        event_name: row.event_name,
                        description: row.description,
                        location: row.location,
                        event_image: row.event_image ? process.env.BASE_URL + `/images/event/` + row.event_image : null,
                        site_plan_image: row.site_plan_image ? process.env.BASE_URL + `/images/site-plan/` + row.site_plan_image : null,
                        url_google_map,
                        event_type: row.event_type,
                        status: row.status,
                        event_start: row.event_start,
                        event_end: row.event_end,
                        event_status,
                        created_at: row.created_at,
                        total_type: 0,
                        total_ticket: 0,
                        total_sold: 0,
                        tickets: []
                    };
                }

                if (row.id_ticket) {
                    events[eventId].tickets.push({
                        id_ticket: row.id_ticket,
                        ticket_type: row.ticket_type,
                        amount: row.amount,
                        sold: row.sold,
                        price: row.price,
                        date_start: row.date_start,
                        date_end: row.date_end
                    });

                    events[eventId].total_type += 1;
                    events[eventId].total_ticket += row.amount;
                    events[eventId].total_sold += row.sold;
                }
            });

            const result = Object.values(events);

            res.json(result);
        }
    });
};


exports.eventInProgress = async (req, res) => {
    const qEventInProgress = `
        SELECT e.id_event, e.id_organization, o.organization_name, e.event_name, e.description, e.location,
               e.event_image, e.site_plan_image, e.type AS event_type, e.status,
               e.event_start, e.event_end, e.created_at, t.id_ticket, t.type AS ticket_type,
               t.amount, t.sold, t.price, t.date_start, t.date_end
        FROM events AS e 
        LEFT JOIN tickets AS t ON e.id_event = t.id_event
        LEFT JOIN organizations AS o ON e.id_organization = o.id_organization
        WHERE e.event_start < CURDATE() AND e.event_end > CURDATE()
    `;

    connection.query(qEventInProgress, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            // Process the rows to create the desired output format
            const events = {};

            rows.forEach(row => {
                const eventId = row.id_event;

                const now = new Date();
                const eventStart = new Date(row.event_start);
                const eventEnd = new Date(row.event_end);
                let event_status = "";
                let base_url_google_map = "https://google.com/maps?q="
                let query_google_map = row.location.split(" ").join("+")
                const url_google_map = base_url_google_map + query_google_map;


                if (now > eventEnd) {
                    event_status = "Past";
                } else if (now < eventStart) {
                    event_status = "Soon";
                } else if (now >= eventStart && now <= eventEnd) {
                    event_status = "On Going";
                }

                if (!events[eventId]) {
                    events[eventId] = {
                        id_event: row.id_event,
                        id_organization: row.id_organization,
                        organization_name: row.organization_name,
                        event_name: row.event_name,
                        description: row.description,
                        location: row.location,
                        event_image: row.event_image ? process.env.BASE_URL + `/images/event/` + row.event_image : null,
                        site_plan_image: row.site_plan_image ? process.env.BASE_URL + `/images/site-plan/` + row.site_plan_image : null,
                        url_google_map,
                        event_type: row.event_type,
                        status: row.status,
                        event_start: row.event_start,
                        event_end: row.event_end,
                        event_status,
                        created_at: row.created_at,
                        total_type: 0,
                        total_ticket: 0,
                        total_sold: 0,
                        tickets: []
                    };
                }

                if (row.id_ticket) {
                    events[eventId].tickets.push({
                        id_ticket: row.id_ticket,
                        ticket_type: row.ticket_type,
                        amount: row.amount,
                        sold: row.sold,
                        price: row.price,
                        date_start: row.date_start,
                        date_end: row.date_end
                    });

                    events[eventId].total_type += 1;
                    events[eventId].total_ticket += row.amount;
                    events[eventId].total_sold += row.sold;
                }
            });

            const result = Object.values(events);

            res.json(result);
        }
    });
};
