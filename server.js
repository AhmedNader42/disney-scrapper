const express = require("express");
const cheerio = require("cheerio");
const path = require("path");
const { listProducts, postToCart, goToBag } = require("./home");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
    listProducts()
        .then((response) => {
            let $ = cheerio.load(response.data);

            $("input[class=csrftoken]").each(function (i, e) {
                let csrf = $(e).attr("value");
                app.set("csrf_token", csrf);
            });

            let products = [];
            $(".product__linkcontainer ").each(function (i, e) {
                // console.log($(e).find("div > picture > img"));
                let product = {
                    index: i,
                    productId: $(e).attr("data-product-id"),
                    title: $(e).attr("title"),
                    URL: $(e).attr("href"),
                    imageURL: $(e).find("div > picture > img").attr("data-src"),
                };
                console.log(product);
                if (product.imageURL != undefined) {
                    products.push(product);
                }
            });
            res.render(path.join(__dirname, "public/templates/list.ejs"), { products: products });
        })
        .catch(function (e) {
            console.log(e);
            res.json({ error: "Failed to fetch list" });
        });
});

app.post("/add", (req, res, next) => {
    console.log(req.body);
    const productID = req.body.product_id;
    const token = app.settings.csrf_token;
    postToCart(productID, token)
        .then(function (response) {
            res.json({ Message: "Success" });
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
            res.json({ Error: "Failed to add to cart" });
        });
});

app.get("/bag", (req, res, next) => {
    goToBag().then((response) => {
        // console.log(response);
        let $ = cheerio.load(response.data);
        let numberOfItems = 0;
        $("span[class=bag-count]").each(function (i, e) {
            let links = $(e).text();
            console.log(links);
            numberOfItems = links;
        });
        res.json({ Number: numberOfItems });
    });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
