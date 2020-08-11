const express = require('express');
const router = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')

router.get('/', (req, res) => {
    let sql = "SELECT * FROM st_customer_info ";
    conn.query(sql, (err, results, fields) => {
        if (err) {
            return res.status(501).json({ message: "error occured on our side " });
        } else {
            let customers = results.map(row => ({ ...row }));
            return res.json({ customers })
        }
    })
})

// add one customer
router.post('/', (req, res) => {
    let { customer } = req.body;
    if (!customer) {
        return res.status(406).json({ err: "provide customer details" });
    }
    let columns = Object.keys(customer);
    let col = columns.join(',');
    let query = "INSERT INTO st_customer_info(" + col + ") VALUES";
    let values = Object.values(customer);
    let qs = columns.map((t) => "?").join(',');
    query += "(" + qs + ")";
    console.log(query);
    conn.query(query, values, (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    })
    return res.json({ msg: "add one customer" })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;

    let sql = "SELECT * FROM st_customer_info WHERE id=?";
    conn.query(sql, [id], (err, results, fields) => {
        if (err) {
            console.log(err);
            return res.status(404).send("customer not found");
        } else {
            let customer = results.map(row => ({ ...row }));
            return res.json({ customer })
        }
    })
})


router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { customer } = req.body;
    if (!customer) {
        return res.status(406).send("details not provided ");
    }
    let query = "UPDATE st_customer_info SET ";
    let values = [];
    Object.entries(customer).forEach((update) => {
        query += `${update[0]}=?,`;
        values.push(update[1]);
    });
    let index = query.lastIndexOf(",");
    let q = query.substring(0, index) + query.substring(index + 1, query.length);
    values.push(id);
    q += ` WHERE id=? `;
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
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json({ message: "id is required" });
    }
    let sql = "DELETE from st_customer_info WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
        console.log(results);
        return res.status(200).json({ message: "done" });
    });
})

module.exports = router;