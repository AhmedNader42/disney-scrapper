const axios = require("axios").default;
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const http = require("http");
const https = require("https");

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

module.exports = {
    cookieJar: cookieJar,
    axios: axios,
};
