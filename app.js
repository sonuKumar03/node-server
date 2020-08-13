var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/root");
var customersRouter = require('./routes/customers');
var employeesRouter = require('./routes/employees');
var expensesRouter = require('./routes/expenses');
var manufacturingRouter = require('./routes/manufacturing');
var paymentsRouter = require('./routes/payments');
var productionsRouter = require('./routes/productions');
var productsRouter = require('./routes/product_category');
var purchasesRouter = require('./routes/purchases');


var ready_stocksRouter = require('./routes/ready_stocks');
var raw_stocksRouter = require('./routes/raw_material_stocks');
var receiptsRouter = require('./routes/receipts');
var transportationsRouter = require('./routes/transportations');
var usersRouter = require('./routes/users');
var vendorsRouter = require('./routes/vendors');

var cors = require("cors");

var app = express();


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes 
app.use("/", indexRouter);
app.use("/customers", customersRouter);
app.use("/employees", employeesRouter);
app.use("/expenses", expensesRouter);
app.use("/manufacturing", manufacturingRouter);
app.use("/payments", paymentsRouter);
app.use("/productions", productionsRouter);
app.use("/product_category", productsRouter);
app.use("/purchases", purchasesRouter);
app.use("/ready_stocks", ready_stocksRouter);
app.use("/raw_stocks", raw_stocksRouter);
app.use("/receipts", receiptsRouter);
app.use("/transportations", transportationsRouter);
app.use("/users", usersRouter);
app.use("/vendors", vendorsRouter);

module.exports = app;