'use strict';

const connection = require('../../connection');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = 'images/';
        if (file.fieldname === 'event_image') {
            path += 'event/';
        } else if (file.fieldname === 'site_plan_image') {
            path += 'site-plan/';
        }
        cb(null, path);
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const randomString = crypto.randomBytes(3).toString('hex');
        const newFilename = `${file.originalname.replace(`.${ext}`, '')}_${randomString}.${ext}`;
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'event_image', maxCount: 1 },
    { name: 'site_plan_image', maxCount: 1 }
]);

exports.eventShow = async (req, res) => {
    const id_organization = req.decoded.id_organization;
    const { time, status } = req.query
    let queryTime = ""
    let queryStatus = ""
    if (time == undefined) {
        queryTime = ""
    } else if (time == "past") {
        queryTime = "AND e.event_end < CURDATE()"
    } else if (time == "on-going") {
        queryTime = "AND e.event_start < CURDATE() AND e.event_end > CURDATE()"
    } else if (time == "soon") {
        queryTime = "AND e.event_start > CURDATE() "
    }

    if (status == undefined) {
        queryStatus = ""
    } else if (status == 0) {
        queryStatus = "AND e.status=0"
    } else if (status == 1) {
        queryStatus = "AND e.status=1"
    } else if (status == 2) {
        queryStatus = "AND e.status=2"
    }

    const qEventShow = `
        SELECT e.id_event, e.id_organization, o.organization_name, e.event_name, e.description, e.location,
               e.event_image, e.site_plan_image, e.type AS event_type, e.status,
               e.event_start, e.event_end, e.created_at, t.id_ticket, t.type AS ticket_type,
               t.amount, t.sold, t.price, t.date_start, t.date_end
        FROM events AS e 
        LEFT JOIN tickets AS t ON e.id_event = t.id_event
        LEFT JOIN organizations AS o ON e.id_organization = o.id_organization
        WHERE o.id_organization=? ${queryTime} ${queryStatus}
    `;

    connection.query(qEventShow, id_organization, function (error, rows) {
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




exports.eventShowId = async (req, res) => {
    const { id_event } = req.params
    const id_organization = req.decoded.id_organization;
    const qEventShow = `
        SELECT e.id_event, e.id_organization, o.organization_name, e.event_name, e.description, e.location,
               e.event_image, e.site_plan_image, e.type AS event_type, e.status,
               e.event_start, e.event_end, e.created_at, t.id_ticket, t.type AS ticket_type,
               t.amount, t.sold, t.price, t.date_start, t.date_end
        FROM events AS e 
        LEFT JOIN tickets AS t ON e.id_event = t.id_event
        LEFT JOIN organizations AS o ON e.id_organization = o.id_organization
        WHERE o.id_organization=? AND e.id_event=?
    `;

    connection.query(qEventShow, [id_organization, id_event], function (error, rows) {
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

exports.eventAdd = async (req, res) => {
    upload(req, res, function (err) {
        const event_image = req.files['event_image'] ? req.files['event_image'][0].filename : null;
        const site_plan_image = req.files['site_plan_image'] ? req.files['site_plan_image'][0].filename : null;

        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        } else {
            const { event_name, description, location, type, event_start, event_end } = req.body;
            const id_organization = req.decoded.id_organization;
            const status = 0;
            let now = new Date();
            let datetimenow = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + ' ' +
                ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);

            if (!(event_name && description && location && type && event_start && event_end && event_image)) {
                if (event_image) fs.unlinkSync(`images/event/${event_image}`);
                if (site_plan_image) fs.unlinkSync(`images/site-plan/${site_plan_image}`);
                return res.status(400).json({ status: 400, message: "Field can't be blank!" });
            } else {
                const qEventAdd = `INSERT INTO events(id_organization,event_name,description,location,event_image,site_plan_image,type,status,event_start,event_end,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
                const vEventAdd = [id_organization, event_name, description, location, event_image, site_plan_image, type, status, new Date(event_start), new Date(event_end), datetimenow];
                connection.query(qEventAdd, vEventAdd, function (error) {
                    if (error) {
                        console.log(error);
                        if (event_image) fs.unlinkSync(`images/event/${event_image}`);
                        if (site_plan_image) fs.unlinkSync(`images/site-plan/${site_plan_image}`);
                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                    } else {
                        return res.status(200).json({ status: 200, message: "Successfully inserted event!" });
                    }
                });
            }
        }
    });
};

exports.eventEdit = async (req, res) => {
    const id_event = req.params.id_event;
    upload(req, res, function (err) {
        const event_image = req.files['event_image'] ? req.files['event_image'][0].filename : null;
        const site_plan_image = req.files['site_plan_image'] ? req.files['site_plan_image'][0].filename : null;

        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        } else {
            const { event_name, description, location, type, event_start, event_end } = req.body;
            const id_organization = req.decoded.id_organization;

            if (!(event_name && description && location && type && event_start && event_end)) {
                if (event_image) fs.unlinkSync(`images/event/${event_image}`);
                if (site_plan_image) fs.unlinkSync(`images/site-plan/${site_plan_image}`);
                return res.status(400).json({ status: 400, message: "Field can't be blank!" });
            } else {
                connection.query(`SELECT event_image, site_plan_image FROM events WHERE id_event = ?`, [id_event], function (error, rows, result) {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                    }
                    const oldEventImage = rows[0].event_image;
                    const oldSitePlanImage = rows[0].site_plan_image;

                    let updateQuery = `UPDATE events SET event_name = ?, description = ?, location = ?, type = ?, event_start = ?, event_end = ?`;
                    let updateValues = [event_name, description, location, type, new Date(event_start), new Date(event_end)];

                    if (event_image) {
                        updateQuery += `, event_image = ?`;
                        updateValues.push(event_image);
                        if (oldEventImage) fs.unlinkSync(`images/event/${oldEventImage}`);
                    }

                    if (site_plan_image) {
                        updateQuery += `, site_plan_image = ?`;
                        updateValues.push(site_plan_image);
                        if (oldSitePlanImage) fs.unlinkSync(`images/site-plan/${oldSitePlanImage}`);
                    }

                    updateQuery += ` WHERE id_event = ? AND id_organization = ?`;
                    updateValues.push(id_event, id_organization);

                    connection.query(updateQuery, updateValues, function (error) {
                        if (error) {
                            console.log(error);
                            if (event_image) fs.unlinkSync(`images/event/${event_image}`);
                            if (site_plan_image) fs.unlinkSync(`images/site-plan/${site_plan_image}`);
                            return res.status(500).json({ status: 500, message: "Internal Server Error" });
                        } else {
                            return res.status(200).json({ status: 200, message: "Successfully updated event!" });
                        }
                    });
                });
            }
        }
    });
};


exports.eventDelete = async (req, res) => {
    const id_organization = req.decoded.id_organization
    const id_event = req.params.id_event
    const qEventDelete = `DELETE FROM events WHERE id_event=? AND id_organization=?`
    connection.query(qEventDelete, [id_event, id_organization], async (error, rows, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            return res.status(200).json({ status: 200, message: "Event has been deleted!" });
        }
    })
}