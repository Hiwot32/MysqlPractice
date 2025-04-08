const mysql=require("mysql2");
const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const cors=require("cors");

app.use(bodyparser.urlencoded({extended:true}));

app.use(cors());

app.listen(4050, (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Listening to the port");
    }
})


const conn=mysql.createConnection({
    host: "localhost",
    user: "myDBuser",
    password: "123@456",
    database: "mydb",
});

conn.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Connected successfully")
    }
});

app.get("/install", (req,res)=>{
let products=`CREATE TABLE products(
    products_id int auto_increment,
    products_url VARCHAR(200) not null,
    products_name VARCHAR(20) not null,
    PRIMARY KEY (products_id)
)`;

let user=`CREATE TABLE users(
    user_id int auto_increment,
    user_name VARCHAR(20) not null,
    user_password VARCHAR(20) not null,
    PRIMARY KEY(user_id)
)`;
let orders=`CREATE TABLE orders(
    order_id int auto_increment,
    products_id int(10) not null,
    user_id int(10) not null,
    PRIMARY KEY(order_id),
    FOREIGN KEY(products_id) REFERENCES products(products_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)`;

let productPrice=`CREATE TABLE product_price(
    price_id int auto_increment,
    products_id int(10) not null,
    starting_price int(20) not null,
    price_range int(20) not null,
    PRIMARY KEY(price_id),
    FOREIGN KEY(products_id) REFERENCES products(products_id)
)`;

let productDiscription=`CREATE TABLE products_description(
    description_id int auto_increment,
    products_id int(10) not null,
    brief_description VARCHAR(200) not null,
    product_description VARCHAR(2000) not null,
    product_imgUrl VARCHAR(200) not null,
    product_link VARCHAR(200) not null,
    PRIMARY KEY (description_id),
    FOREIGN KEY(products_id) REFERENCES products(products_id)
)`;



conn.query(products, (err,results,field)=>{
    if(err){
        console.log(err);
    }
});
conn.query(user, (err,results,field)=>{
    if(err){
        console.log(err);
    }
});
conn.query(orders,(err,results,field)=>{
    if(err){
        console.log(err);
    }
});
conn.query(productPrice, (err,results,field)=>{
    if(err){
        console.log(err);
    }
});
conn.query(productDiscription,(err,result,field)=>{
    if(err){
        console.log(err);
    }
});

res.end("Tables are created");

});

app.post("/add-product", (req,res)=>{
    let name=req.body.pname;
    let url=req.body.purl;
    let userName=req.body.uname;
    let password=req.body.password;
    let price=req.body.sprice;
    let range=req.body.range;
    let briefDesc=req.body.bdescription;
    let desc=req.body.description;
    let img=req.body.imgUrl;
    let productlink=req.body.plink;

    let insertUser = `INSERT INTO users(user_name, user_password) VALUES (?, ?)`;
    conn.query(insertUser, [userName, password], (err, userResult) => {
        if (err) {
            console.log(err);
        }
        let userId = userResult.insertId;

        // Insert product
        let insertProduct = `INSERT INTO products(products_url, products_name) VALUES (?, ?)`;
        conn.query(insertProduct, [url, name], (err, productResult) => {
            if (err) {
                console.log(err);
            }
            let productId = productResult.insertId;

            // Insert order
            let insertOrder = `INSERT INTO orders(products_id, user_id) VALUES (?, ?)`;
            conn.query(insertOrder, [productId, userId], (err, orderResult) => {
                if (err) {
                    console.log(err);
                }

                // Insert price
                let insertPrice = `INSERT INTO product_price(products_id, starting_price, price_range) VALUES (?, ?, ?)`;
                conn.query(insertPrice, [productId, price, range], (err, priceResult) => {
                    if (err) {
                        console.log(err);
                    }

                    // Insert description
                    let insertDescription = `INSERT INTO products_description(products_id, brief_description, product_description, product_imgUrl, product_link) VALUES (?, ?, ?, ?, ?)`;
                    conn.query(insertDescription, [productId, briefDesc, desc, img, productlink], (err, descResult) => {
                        if (err) {
                            console.log(err);
                        }

                        res.send("Product and related info added successfully!");
                    });
                });
            });
        });
    }); 
});

