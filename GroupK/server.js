const oracledb = require('oracledb');
const express = require('express');
const app = express();

const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.env.TNS_ADMIN = "/F:/wallet";



// 在此设置路由和数据库连接，响应客户端请求
app.get('/getProductInfo/:productId', (req, res) => {
    const selectedProductId = req.params.productId;

    oracledb.getConnection({
        user: 'ADMIN',
        password: 'GroupK123456',
        connectString: 'adb.eu-paris-1.oraclecloud.com:1522/gbbf3e64fad7831_groupk_high.adb.oraclecloud.com'
    }, function (err, connection) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database connection error' });
        }

        const sql = `
            SELECT p.name, p.description, i.quantity, p.price
            FROM products p
            JOIN inventory i ON p.product_id = i.product_id
            WHERE i.product_id = :productId
        `;

        connection.execute(sql, [selectedProductId], function (err, result) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Database query error' });
            } else {
                const productInfo = result.rows[0];
                return res.json({
                    name: productInfo[0],
                    description: productInfo[1],
                    quantity: productInfo[2],
                    price: productInfo[3]
                });
            }

            connection.close(function (err) {
                if (err) {
                    console.error(err.message);
                }
            });
        });
    });
});
