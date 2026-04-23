const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const Product = require('../../models/productModel');
const dbConnection = require('../../config/database');

dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('DB_URI =', process.env.DB_URI);

dbConnection();

const productsPath = path.join(__dirname, 'products.json');

const products = JSON.parse(
    fs.readFileSync(productsPath, 'utf-8')
);

const insertData = async () => {
    try {
        await Product.create(products);
        console.log('Data Inserted Successfully');
        process.exit();
    } catch (error) {
        console.log('Insert Error:', error.message);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log('Data Deleted Successfully');
        process.exit();
    } catch (error) {
        console.log('Delete Error:', error.message);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    insertData();
} else if (process.argv[2] === '-d') {
    destroyData();
} else {
    console.log('Use -i to insert or -d to delete');
}