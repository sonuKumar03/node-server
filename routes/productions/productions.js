const express = require('express');
const router = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')

router.get('/', (req, res) => {
    let sql = "SELECT * FROM st_production_info ";
    conn.query(sql, (err, results, fields) => {
        if (err) {
            return res.status(501).json({ message: "error occured on our side " });
        } else {
            let productions = results.map(row => ({ ...row }));
            return res.json({ productions })
        }
    })
})

//
router.get("/forTable", function(req, res) {
    let categories_sql = "SELECT * from  st_production_info a INNER JOIN st_ready_product_stock b on a.ready_product_id=b.product_id inner join st_product_category c on b.product_category_id = c.id ";

    conn.query(categories_sql, (err, results, fields) => {
        if (err) {
            return res.status(501).json({ message: "server error", error: err });
        }
        return res.json({ tableData: results });
    })
});


// add one production
router.post('/', (req, res) => {
    let { production } = req.body;
    if (!production) {
        return res.status(406).json({ err: "provide production details" });
    }

    let { production_date } = production;
    production = { ...production,
        entry_date_time: production_date,
        production_date
    }
    let columns = Object.keys(production);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_production_info(" + columns + ") VALUES";
    let values = Object.values(production);
    let qs = columns.map((t) => "?").join(',');
    query += "(" + qs + ")";
    conn.query(query, values, (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    })
    return res.json({ msg: "add one production" })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;

    let sql = "SELECT * FROM st_production_info WHERE id=?";
    conn.query(sql, [id], (err, results, fields) => {
        if (err) {
            console.log(err);
            return res.status(404).send("production not found");
        } else {
            let production = results.map(row => ({ ...row }));
            return res.json({ production })
        }
    })
})


router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { production } = req.body;
    if (!production) {
        return res.status(406).send("details not provided ");
    }
    let query = "UPDATE st_production_info SET ";
    let values = [];
    Object.entries(production).forEach((update) => {
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
    let sql = "DELETE from st_production_info WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
        console.log(results);
        return res.status(200).json({ message: "done" });
    });
})

module.exports = router;