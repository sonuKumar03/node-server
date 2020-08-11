var express = require("express");
const mysql = require("mysql");
const conn = require("../../db/index");

var router = express.Router();

router.get("/", function(req, res) {
    let sql = "SELECT * FROM st_vendor_info ";
    conn.query(sql, (err, results, fields) => {
        if (err) {} else {
            let vendors = results.map((row) => ({ ...row }));
            return res.json({ vendors });
        }
    });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    let sql = "SELECT * FROM st_vendor_info WHERE vendor_id=?";
    conn.query(sql, [id], (err, results, fields) => {
        if (err) {
            return res.status(501).json({ message: "server error" });
        }
        if (results.length == 0) {
            return res.status(404).json({ msg: "vendor not exits" });
        }
        return res.status(200).json(results.map((res) => ({ ...res })));
    });
});

// add vendor
router.post("/", (req, res) => {
    const { vendor } = req.body;
    if (!vendor.balance) {
        vendor.balance = 0;
    }
    let values = Object.values(vendor);
    conn.query(
        "INSERT INTO st_vendor_info(`person_name`,`company_name`,`city`,`address`,`email_id`,`contact_one`,`contact_two`,`balance`) VALUES(?,?,?,?,?,?,?,?)",
        values,
        (err, results, fields) => {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
            }
        }
    );
    return res.json({ vendor });
});

router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const { vendor } = req.body;
    if (!id || !vendor) {
        return res.json({
            messgae: "id or vendor details not provided "
        })
    }

    let query = "UPDATE st_vendor_info SET ";
    let values = [];
    Object.entries(vendor).forEach((update) => {
        query += `${update[0]}=?,`;
        values.push(update[1]);
    });
    let index = query.lastIndexOf(",");
    let q = query.substring(0, index) + query.substring(index + 1, query.length);
    values.push(id);
    q += ` WHERE vendor_id=? `;
    let sql_query = mysql.format(q, values);
    if (sql_query.length > 1) {
        conn.query(sql_query, (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.json({ err });
            }
            return res.json({ results });
        });
    }
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.json({ err: "id is required" });
    }
    let sql = "DELETE from st_vendor_info WHERE vendor_id=?";
    conn.query(sql, [id], (err, results, fields) => {
        console.log(results);
        return res.status(200).json({ message: "done" });
    });
});

module.exports = router;