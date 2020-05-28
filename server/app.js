const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.json());

app.use(express.static("../dist/Campuschain"));

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  );

  // console.log(req.method, req.url);

  if (req.method === "POST") {
    var targetURL = "http://chain.vjti-bct.in:9000";

    request(
      {
        url: targetURL + req.url,
        method: req.method,
        json: req.body,
        headers: { Authorization: req.header("Authorization") },
      },
      function (error, response, body) {
        if (error) {
          console.error("error: " + response.statusCode);
        }
        //                console.log(body);
      }
    ).pipe(res);
  } else {
    res.send();
  }
});

const server = app.listen(process.env.PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);
  //at localhost: http://localhost:8081/
});
