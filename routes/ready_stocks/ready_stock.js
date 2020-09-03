var express = require("express");
const mysql = require("mysql");
const conn = require("../../db/index");
var router = express.Router();

let id_check = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.json({ err: "id is required" });
    }
    let check_id_query =
        "SELECT product_id from st_ready_product_stock WHERE product_id=?";
    conn.query(check_id_query, [id], (err, results, fields) => {
        if (err) {
            return res.json({ message: "internal error occured ", error: err });
        }
        if (results.length == 0) {
            return res.json({
                message: " ready_product of provided id doesn't exit ",
            });
        }
        next();
    });
};

router.get("/", function(req, res) {
    let sql = "SELECT * FROM st_ready_product_stock ";
    conn.query(sql, (err, results, fields) => {
        if (err) {
            return res.json({ message: "error ", error: err });
        } else {
            let ready_products = results.map((row) => ({ ...row }));
            return res.json({ ready_products });
        }
    });
});

router.get("/forTable", function(req, res) {
    let categories_sql = "SELECT * from  st_product_category CROSS JOIN st_ready_product_stock";

    conn.query(categories_sql, (err, results, fields) => {
        if (err) {
            return res.status(501).json({ message: "server error", error: err });
        }
        return res.json({ tableData: results });
    })
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    let sql = "SELECT * FROM st_ready_product_stock WHERE product_id=?";
    conn.query(sql, [id], (err, results, fields) => {
        if (err) {
            return res.status(501).json({ message: "server error", error: err });
        }
        if (results.length == 0) {
            return res.status(404).json({ msg: "ready product not exits" });
        }
        const ready_products = results.map((res) => ({ ...res }));
        return res.status(200).json({ ready_product: ready_products[0] });
    });
});

// add ready_product
router.post("/", (req, res) => {
    const { ready_product } = req.body;
    let values = Object.values(ready_product);
    let cols = Object.keys(ready_product);
    let insrt_query =
        "INSERT INTO st_ready_product_stock ( " +
        cols.map((col) => `${col}`).join(",") +
        " ) VALUES ( " +
        cols.map((col) => "?").join(",") +
        " )";
    conn.query(insrt_query, values, (err, results, fields) => {
        if (err) {
            console.log(err);
            return res.json({
                error: err,
            });
        } else {
            console.log(results);
            return res.json({ message: "ready_product created successfully" });
        }
    });
});

router.patch("/:id", id_check, (req, res) => {
    const { id } = req.params;
    const { ready_product } = req.body;
    console.log(id, ready_product);
    let keys = Object.keys(ready_product);
    let values = Object.values(ready_product);
    values.push(id);
    let update_query =
        "UPDATE st_ready_product_stock SET " +
        keys.map((key) => `${key}=?`).join(",") +
        " WHERE product_id=? ";
    conn.query(update_query, values, (err, results, fields) => {
        if (err) {
            return res
                .status(456)
                .json({ message: "some error occured ", error: err });
        }
        return res
            .status(200)
            .json({ message: " ready_product of provided id updated  " });
    });
});

router.delete("/:id", id_check, (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.json({ err: "id is required" });
    }
    let sql = "DELETE from st_ready_product_stock WHERE product_id=?";
    conn.query(sql, [id], (err, results, fields) => {
        console.log(results);
        return res
            .status(200)
            .json({ message: " ready_product of provided id deleted  " });
    });
});

router.get("/subs/:id", (req, res) => {
    const { id } = req.params;
    let sql = "SELECT * FROM st_ready_product_stock ";
    conn.query(sql, (err, results, fields) => {
        if (err) {
            return res.json({ message: "error ", error: err });
        } else {
            let ready_products = results.map((row) => ({ ...row }));
            console.log(ready_products[0]["product_category_id"], Number(id));
            ready_products = ready_products.filter(
                (f) => f["product_category_id"] === Number(id)
            );
            return res.json({ ready_products });
        }
    });
});

module.exports = router;