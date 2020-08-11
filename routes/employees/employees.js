const express = require('express');
const router = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')
router.get('/categories', (req, res) => {
    let sql = "SELECT * FROM st_employee_category";
    conn.query(sql, (err, results, fields) => {
        if (err) {
            return res.json({
                categories: [],
                error: err,
                messsage: "some error occured"
            })
        } else {
            let categories = results.map((row) => ({ ...row }));
            return res.json({ categories });
        }
    });
})

router.post('/categories', (req, res) => {
    const { categories } = req.body;
    if (!categories) {
        return res.status(406).json({
            message: "category is required"
        })
    }
    let columns = Object.keys(categories);
    let query = "INSERT INTO st_employee_category(" + columns + ") VALUES";
    let values = Object.values(categories);
    let qs = columns.map((t) => "?").join(',');
    query += "(" + qs + ")";
    conn.query(query, values, (err, results, fields) => {
        if (err) {
            console.log(err);
            return res.json({ messsage: "category not added", error: err })
        } else {
            console.log(results);
            return res.json({ messsage: "category added" })
        }
    })
})

// add one emp
router.post('/', (req, res) => {
    let { employee } = req.body;
    if (!employee) {
        return res.status(406).json({ err: "provide employee details" });
    }
    let columns = Object.keys(employee);
    console.log(columns);
    let query = "INSERT INTO st_employee_info(" + columns + ") VALUES";
    let values = Object.values(employee);
    let qs = columns.map((t) => "?").join(',');
    query += "(" + qs + ")";
    conn.query(query, values, (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    })
    return res.json({ messsage: "employee added" })
})

router.get('/', (req, res) => {
    let sql = "SELECT * FROM st_employee_info ";
    conn.query(sql, (err, results, fields) => {
        if (err) {
            return res.json({
                error: err,
                messsage: "some error occured"
            })
        } else {
            let employees = results.map((row) => ({ ...row }));
            return res.json({ employees });
        }
    });
})


router.get('/:id', (req, res) => {
    const { id } = req.params;
    let sql = "SELECT * FROM st_employee_info WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
        if (err) {
            return res.status(501).json({ message: "server error" });
        }
        if (results.length == 0) {
            return res.status(404).json({ msg: "employee not exits" });
        }
        return res.status(200).send(results.map((res) => ({ ...res })));
    });
})


router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { employee } = req.body;
    let query = "UPDATE st_employee_info SET ";
    let values = [];
    Object.entries(employee).forEach((update) => {
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
                return res.json({ error: err });
            }
            return res.json({ results });
        });
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.json({ error: "id is required" });
    }
    let sql = "DELETE from st_employee_info WHERE id= ? ";
    conn.query(sql, [id], (err, results, fields) => {
        console.log(results);
        return res.status(200).send("done");
    });
})

module.exports = router;