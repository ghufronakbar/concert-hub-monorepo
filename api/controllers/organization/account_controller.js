'use strict';

const response = require('../../res');
const connection = require('../../connection');
const md5 = require('md5');
const ip = require('ip');
const config = require('../../config/secret')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = 'images/';
        if (file.fieldname === 'logo') {
            path += 'logo/';
        } else if (file.fieldname === 'ktp') {
            path += 'ktp/';
        } else if (file.fieldname === 'legality_letter') {
            path += 'legality-letter/';
        }
        cb(null, path);
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const randomString = crypto.randomBytes(3).toString('hex');
        const newFilename = file.originalname.replace(`.${ext}`, `_${randomString}.${ext}`);
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'logo', maxCount: 1 },
    { name: 'ktp', maxCount: 1 },
    { name: 'legality_letter', maxCount: 1 }
]);

//LOGIN
exports.login = function (req, res) {

    var post = {
        email: req.body.email,
        password: req.body.password
    }

    console.log(post)

    const qValidateStatus = `SELECT * FROM organizations WHERE email=?`
    const vValidateStatus = post.email

    connection.query(qValidateStatus, vValidateStatus,
        function (error, rows, result) {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                if (rows.length == 0){
                    return res.status(400).json({status:400, message:"Email doesn't exist, please register first!"})
                }
                const validateStatus = rows[0].status
                if (validateStatus != 2) {
                    return res.status(404).json({ status: 404, message: "Yoa are not allowed to login!" });
                } else {
                    var query = "SELECT id_organization FROM ?? WHERE ??=? AND ??=?";
                    var table = ["organizations", "password", md5(post.password), "email", post.email];

                    query = connection.format(query, table);
                    connection.query(query, function (error, rows) {
                        if (error) {
                            console.log(error)
                        } else {
                            if (rows.length == 0) {
                                res.json({
                                    "Error": true,
                                    "Message": "Emaill or Password doesn't match!"
                                })

                            } else if (rows.length == 1) {
                                var token = jwt.sign({ rows }, config.secret, {
                                    expiresIn: 99999999
                                });
                                let id_organization = rows[0].id_organization;

                                var data = {
                                    id_organization: id_organization,
                                    token: token,
                                    ip_address: ip.address()
                                }
                                var query = "INSERT INTO ?? SET ?";
                                var table = ["akses_token"];

                                query = connection.format(query, table);
                                connection.query(query, data, function (error, rows) {
                                    if (error) {
                                        console.log(error)
                                    } else {
                                        res.json({
                                            success: true,
                                            message: "Token JWT Generated!",
                                            token: token,
                                            currUser: data.id_organization
                                        });
                                    }
                                });
                            }
                        }
                    })
                }
            }
        }
    )
}



exports.profile = async (req, res) => {
    const id_organization = req.decoded.id_organization
    const qProfile = "SELECT id_organization,organization_name,email,phone,logo,ktp,legality_letter,status FROM organizations WHERE id_organization=?"
    connection.query(qProfile, id_organization,
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                const organizations = {};
                rows.forEach(row => {
                    const orgId = row.id_organization;
    
                    
                    if (!organizations[orgId]) {
                        organizations[orgId] = {
                            id_organization: row.id_organization,
                            organization_name: row.organization_name,
                            email: row.email,
                            phone: row.phone,
                            logo: process.env.BASE_URL + `/images/logo/` + row.logo,
                            ktp: process.env.BASE_URL + `/images/ktp/` + row.ktp,
                            legality_letter: process.env.BASE_URL + `/images/legality-letter/` + row.legality_letter,
                            status: row.status
                        };
                    }
    
                    
                });
    
                const result = Object.values(organizations);
    
                res.json(result);
            }
        }
    )
}



exports.register = async (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        } else {
            const { organization_name, email, phone, password, confirmation_password } = req.body;
            const logo = req.files['logo'] ? req.files['logo'][0].filename : null;
            const ktp = req.files['ktp'] ? req.files['ktp'][0].filename : null;
            const legality_letter = req.files['legality_letter'] ? req.files['legality_letter'][0].filename : null;

            if (!organization_name || !email || !phone || !password || !confirmation_password || !logo || !ktp || !legality_letter) {
                fs.unlinkSync(`images/logo/${logo}`);
                fs.unlinkSync(`images/ktp/${ktp}`);
                fs.unlinkSync(`images/legality-letter/${legality_letter}`);
                return res.status(402).json({ status: 402, message: "Form tidak boleh kosong!" });
            } else {
                const qValidation = `SELECT email FROM organizations WHERE email=?`;
                connection.query(qValidation, email, function (error, rows) {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                    } else {
                        const vEmail = rows.length;
                        if (vEmail) {
                            fs.unlinkSync(`images/logo/${logo}`);
                            fs.unlinkSync(`images/ktp/${ktp}`);
                            fs.unlinkSync(`images/legality-letter/${legality_letter}`);
                            return res.status(400).json({ status: 400, message: "Email sudah terdaftar!" });
                        } else {
                            if (password !== confirmation_password) {
                                fs.unlinkSync(`images/logo/${logo}`);
                                fs.unlinkSync(`images/ktp/${ktp}`);
                                fs.unlinkSync(`images/legality-letter/${legality_letter}`);
                                return res.status(401).json({ status: 401, message: "Konfirmasi password salah!" });
                            } else {
                                const qRegister = `INSERT INTO organizations(organization_name,email,phone,password,logo,ktp,legality_letter,status) VALUES(?,?,?,?,?,?,?,?)`;
                                const vRegister = [organization_name, email, phone, md5(password), logo, ktp, legality_letter, 0];
                                connection.query(qRegister, vRegister, function (error) {
                                    if (error) {
                                        console.log(error);
                                        fs.unlinkSync(`images/logo/${logo}`);
                                        fs.unlinkSync(`images/ktp/${ktp}`);
                                        fs.unlinkSync(`images/legality-letter/${legality_letter}`);
                                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                                    } else {
                                        return res.status(200).json({ status: 200, message: "Register sukses!" });
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
    });
};


exports.editProfile = async (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        } else {
            const id_organization = req.decoded.id_organization;
            const { organization_name, email, phone } = req.body;
            const logo = req.files['logo'] ? `${req.files['logo'][0].filename}` : null;

            if (!organization_name || !email || !phone) {
                return res.status(400).json({ status: 400, message: "Field can't be blank" });
            } else {
                connection.query(`SELECT email, logo FROM organizations WHERE id_organization=?`, id_organization,
                    function (error, r) {
                        if (error) {
                            console.log(error);
                            if (logo) fs.unlinkSync(logo);
                            return res.status(500).json({ status: 500, message: "Internal Server Error" });
                        } else {
                            const currentEmail = r[0].email;
                            const currentLogo = r[0].logo;

                            const updateProfile = async () => {
                                let qEditProfile, vEditProfile;
                                if (email === currentEmail) {
                                    qEditProfile = `UPDATE organizations SET organization_name=?, phone=? ${logo ? ',logo=?' : ''} WHERE id_organization=?`;
                                    vEditProfile = logo ? [organization_name, phone, logo, id_organization] : [organization_name, phone, id_organization];
                                } else {
                                    qEditProfile = `UPDATE organizations SET organization_name=?, email=?, phone=? ${logo ? ',logo=?' : ''} WHERE id_organization=?`;
                                    vEditProfile = logo ? [organization_name, email, phone, logo, id_organization] : [organization_name, email, phone, id_organization];
                                }

                                connection.query(qEditProfile, vEditProfile, function (error) {
                                    if (error) {
                                        console.log(error);
                                        if (logo) fs.unlinkSync(logo);
                                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                                    } else {
                                        if (logo && currentLogo) fs.unlinkSync(`images/logo/` + currentLogo);
                                        return res.status(200).json({ status: 200, message: "Update profile successfully" });
                                    }
                                });
                            };

                            if (email === currentEmail) {
                                updateProfile();
                            } else {
                                connection.query(`SELECT * FROM organizations WHERE email=? AND NOT email=?`, [email, currentEmail],
                                    function (error, rows) {
                                        if (error) {
                                            console.log(error);
                                            if (logo) fs.unlinkSync(logo);
                                            return res.status(500).json({ status: 500, message: "Internal Server Error" });
                                        } else {
                                            if (rows.length) {
                                                if (logo) fs.unlinkSync(logo);
                                                return res.status(401).json({ status: 401, message: `Email ${email} already exists` });
                                            } else {
                                                updateProfile();
                                            }
                                        }
                                    });
                            }
                        }
                    });
            }
        }
    });
};


exports.editPassword = async (req, res) => {
    let old_password = md5(req.body.old_password);
    let new_password = md5(req.body.new_password);
    let id_organization = req.decoded.id_organization;
    
    // Periksa old_password dengan melakukan SELECT query
    connection.query(`
        SELECT password FROM organizations WHERE id_organization = ?`,
        [id_organization],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.error("Error occurred while fetching old password", res);
            } else {
                // Periksa apakah password lama cocok
                if (rows.length > 0) {
                    if (rows[0].password === old_password) {
                        // Jika password lama cocok, lakukan update password
                        connection.query(`
                            UPDATE organizations SET password=? WHERE id_organization=?`,
                            [new_password, id_organization],
                            function (error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                    response.error("Error occurred while updating password", res);
                                } else {
                                    response.ok("Password updated successfully", res);
                                }
                            }
                        );
                    } else {
                        response.error("Old password does not match", res);
                    }
                } else {
                    response.error("Instance not found", res);
                }
            }
        }
    );
};
