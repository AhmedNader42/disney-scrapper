const cheerio = require("cheerio");
var { cookieJar, axios } = require("./request");
var qs = require("qs");

let csrf = "undefined";

var get_listProductsConfig = {
    method: "get",
    url: "https://www.shopdisney.co.uk/disney-store-disney-princess-costume-collection-for-kids-2841047080168M.html",
    headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        // Connection: "keep-alive",
    },
    jar: cookieJar,
    withCredentials: true,
};

axios(get_listProductsConfig)
    .then((response) => {
        let $ = cheerio.load(response.data);

        $("input[class=csrftoken]").each(function (i, e) {
            let links = $(e).attr("value");
            csrf = links;
            console.log(csrf);
        });

        postToCart();
    })
    .catch(function (e) {
        console.log(e);
    });

let i = 0;
function postToCart() {
    console.log(csrf);
    var data = qs.stringify({
        Quantity: "1",
        csrf_token: String(csrf),
        format: "ajax",
        pid: "428421122338",
    });

    var post_addToCartConfig = {
        method: "post",
        url: "https://www.shopdisney.co.uk/on/demandware.store/Sites-disneyuk-Site/en_GB/Cart-AddProduct",
        jar: cookieJar, // tough.CookieJar or boolean
        withCredentials: true, // If true, send cookie stored in jar
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            DNT: "1",
            "X-Requested-With": "XMLHttpRequest",
            "sec-ch-ua-mobile": "?0",
            "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36`,
            "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            Accept: "*/*",
        },
        data: data,
    };

    axios(post_addToCartConfig)
        .then(function (response) {
            console.log(response.data);
            if (i < 2) {
                postToCart();
                i++;
            } else {
                goToBag();
            }
            // goToBag();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function goToBag() {
    const get_bagConfig = {
        method: "get",
        url: "https://www.shopdisney.co.uk/bag",
        jar: cookieJar,
        withCredentials: true,
        headers: {
            "sec-ch-ua": `Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91`,
            "sec-ch-ua-mobile": "?0",
            DNT: 1,
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36`,
            Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
        },
    };
    axios(get_bagConfig).then((response) => {
        // console.log(response);
        let $ = cheerio.load(response.data);
        $("span[class=bag-count]").each(function (i, e) {
            let links = $(e).text();
            console.log(links);
        });
    });
}
