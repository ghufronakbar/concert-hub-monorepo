'use strict';

const connection = require('../../connection');

exports.orgShow = async (req, res) => {
    const { status } = req.query;    
    let queryStatus = ""

    if (status !== undefined) {
        if (status) {
            queryStatus=`WHERE o.status = ${status}`
        } 
    }    

    const qOrgShow = `
        SELECT o.id_organization, o.organization_name, o.email, o.phone, o.logo, o.ktp, 
               o.legality_letter, o.status AS org_status,
               e.id_event, e.event_name, e.description, e.location, e.event_image, 
               e.site_plan_image, e.type, e.status AS event_status,
               e.event_start, e.event_end, e.created_at
        FROM organizations AS o 
        LEFT JOIN events AS e ON o.id_organization = e.id_organization ${queryStatus}
    `;

    connection.query(qOrgShow, function (error, rows) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            // Process the rows to create the desired output format
            const organizations = {};

            rows.forEach(row => {
                const orgId = row.id_organization;

                let base_url_google_map = "https://google.com/maps?q="
                let url_google_map = ""
                if(row.id_event){
                    let query_google_map = row.location.split(" ").join("+")
                    url_google_map = base_url_google_map + query_google_map;
                }
                

                if (!organizations[orgId]) {
                    organizations[orgId] = {
                        id_organization: row.id_organization,
                        organization_name: row.organization_name,
                        email: row.email,
                        phone: row.phone,
                        logo: process.env.BASE_URL + `/images/logo/` + row.logo,
                        ktp: process.env.BASE_URL + `/images/ktp/` + row.ktp,
                        legality_letter: process.env.BASE_URL + `/images/legality-letter/` + row.legality_letter,
                        status: row.org_status,
                        events: []
                    };
                }

                if (row.id_event) {
                    organizations[orgId].events.push({
                        id_event: row.id_event,
                        event_name: row.event_name,
                        description: row.description,
                        location: row.location,
                        url_google_map,
                        event_image: row.event_image,
                        site_plan_image: row.site_plan_image,
                        type: row.type,
                        event_status: row.event_status,
                        event_start: row.event_start,
                        event_end: row.event_end,
                        created_at: row.created_at
                    });
                }
            });

            const result = Object.values(organizations);

            res.json(result);
        }
    });
};


exports.orgShowId = async (req, res) => {
    const { id_organization } = req.params
    const qOrgShowId = `
        SELECT o.id_organization, o.organization_name, o.email, o.phone, o.logo, o.ktp, 
               o.legality_letter, o.status AS org_status,
               e.id_event, e.event_name, e.description, e.location, e.event_image, 
               e.site_plan_image, e.type, e.status AS event_status,
               e.event_start, e.event_end, e.created_at
        FROM organizations AS o 
        LEFT JOIN events AS e ON o.id_organization = e.id_organization WHERE o.id_organization=?
    `;

    connection.query(qOrgShowId, [id_organization], function (error, rows) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            // Process the rows to create the desired output format
            const organizations = {};

            rows.forEach(row => {
                const orgId = row.id_organization;
               let base_url_google_map = "https://google.com/maps?q="
                let url_google_map = ""
                if(row.id_event){
                    let query_google_map = row.location.split(" ").join("+")
                    url_google_map = base_url_google_map + query_google_map;
                }

                if (!organizations[orgId]) {
                    organizations[orgId] = {
                        id_organization: row.id_organization,
                        organization_name: row.organization_name,
                        email: row.email,
                        phone: row.phone,
                        logo: process.env.BASE_URL + `/images/logo/` + row.logo,
                        ktp: process.env.BASE_URL + `/images/ktp/` + row.ktp,
                        legality_letter: process.env.BASE_URL + `/images/legality-letter/` + row.legality_letter,
                        status: row.org_status,
                        events: []
                    };
                }

                if (row.id_event) {
                    organizations[orgId].events.push({
                        id_event: row.id_event,
                        event_name: row.event_name,
                        description: row.description,
                        location: row.location,
                        url_google_map,
                        event_image: row.event_image,
                        site_plan_image: row.site_plan_image,
                        type: row.type,
                        event_status: row.event_status,
                        event_start: row.event_start,
                        event_end: row.event_end,
                        created_at: row.created_at
                    });
                }
            });

            const result = Object.values(organizations);

            res.json(result);
        }
    });
};


exports.orgApprove = async (req, res) => {
    const { id_organization } = req.params
    const qOrgApprove = `UPDATE organizations SET status=2 WHERE id_organization = ?`

    connection.query(qOrgApprove, [id_organization],
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                res.status(200).json({ status: 200, message: "This organization has been approved!" });
            }
        }
    )
};


exports.orgBanned = async (req, res) => {
    const { id_organization } = req.params
    const qOrgBanned = `UPDATE organizations SET status=1 WHERE id_organization = ?`

    connection.query(qOrgBanned, [id_organization],
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                res.status(200).json({ status: 200, message: "This organization has been banned!" });
            }
        }
    )
};


exports.orgReject = async (req, res) => {
    const { id_organization } = req.params
    const qOrgReject = `DELETE FROM organizations WHERE id_organization=?`

    connection.query(qOrgReject, [id_organization],
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                res.status(200).json({ status: 200, message: "This request organization has been rejected!" });
            }
        }
    )
};


