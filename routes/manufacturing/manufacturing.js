const express = require("express");
const router = express.Router();
const conn = require("../../db/index");
const mysql = require("mysql");

router.get("/", (req, res) => {
  let sql = "SELECT * FROM st_manufacturing_raw_qty_info ";
  conn.query(sql, (err, results, fields) => {
    if (err) {
      return res.status(501).json({ message: "error occured on our side " });
    } else {
      let manufacturing_raw_qtys = results.map((row) => ({ ...row }));
      return res.json({ manufacturing_raw_qtys });
    }
  });
});

// add one manufacturing_raw_qty
router.post("/", (req, res) => {
  let { manufacturing_raw_qty } = req.body;
  if (!manufacturing_raw_qty) {
    return res
      .status(406)
      .json({ err: "provide manufacturing_raw_qty details" });
  }
  let {
    ready_product_id,
    raw_material_id,
    raw_material_per_unit_qty,
    raw_material_per_unit_rate,
  } = manufacturing_raw_qty;
  let query =
    "INSERT INTO st_manufacturing_raw_qty_info(`ready_product_id`,`raw_material_id`,`raw_material_per_unit_qty`,`raw_material_per_unit_rate`)VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE `raw_material_per_unit_qty`=?,`raw_material_per_unit_rate`=? ";

  // let columns = Object.keys(manufacturing_raw_qty);
  // let col = columns.join(',');
  // console.log(columns);
  // let query = "INSERT INTO st_manufacturing_raw_qty_info(" + columns + ") VALUES";
  // let values = Object.values(manufacturing_raw_qty);
  // let qs = columns.map((t) => "?").join(',');
  // query += "(" + qs + ")";
  conn.query(query, [ready_product_id,raw_material_id,raw_material_per_unit_qty,raw_material_per_unit_rate,raw_material_per_unit_qty,raw_material_per_unit_rate], (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.json({error:err})
    } else {
      console.log(results);
      return res.json({ msg: "add one manufacturing_raw_qty" });
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  let sql = "SELECT * FROM st_manufacturing_raw_qty_info WHERE id=?";
  conn.query(sql, [id], (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.status(404).send("manufacturing_raw_qty not found");
    } else {
      let manufacturing_raw_qty = results.map((row) => ({ ...row }));
      return res.json({ manufacturing_raw_qty });
    }
  });
});

router.get("/ready_product/:id", (req, res) => {
  const { id } = req.params;
  let sql =
    "select * from st_manufacturing_raw_qty_info a left join st_raw_material_stock b on a.raw_material_id = b.product_id";
  conn.query(sql, [id], (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.status(404).send("manufacturing_raw_qty not found");
    } else {
      let manufacturing_raw_qty = results.map((row) => ({ ...row }));
      let data = manufacturing_raw_qty.filter(
        (t) => t.ready_product_id === Number(id)
      );
      return res.json({ manufacturing_raw_qty: data });
    }
  });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { manufacturing_raw_qty } = req.body;
  if (!manufacturing_raw_qty) {
    return res.status(406).send("details not provided ");
  }
  let query = "UPDATE st_manufacturing_raw_qty_info SET ";
  let values = [];
  Object.entries(manufacturing_raw_qty).forEach((update) => {
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
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ message: "id is required" });
  }
  let sql = "DELETE from st_manufacturing_raw_qty_info WHERE id=? ";
  conn.query(sql, [id], (err, results, fields) => {
    console.log(results);
    return res.status(200).json({ message: "done" });
  });
});

module.exports = router;
