var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Isaac",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    products();
});

function products() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        inquirer.prompt([

            {
                type: "list",
                name: "productID",
                message: "Choose the ID of the product you wish to purchase.",
                choices: ["1","2","3","4","5","6","7","8","9","10"]
            },

            {
                type: "input",
                name: "amount",
                message: "How many of those would you like to purchase?"
            }

        ]).then(function (user) {
            var id = (parseInt(user.productID) - 1);
            if (user.amount > res[id].stock_quantity) {
                console.log("Not enough in stock.");
            } else if (user.amount <= res[id].stock_quantity) {
                console.log("Added to cart.");
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[id].stock_quantity - user.amount
                        },
                        {
                            product_name: res[id].product_name
                        }
                    ],
                    function(err, res) {
                    }
            )
                    console.log(res[id].price * user.amount);
            }
            connection.end();
        })
    })
}