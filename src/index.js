var http = require("http");
let fs = require("fs");

var path = require("path");

http
  .createServer(function (req, res) {
    /*
    const allowedOrigins = [
      "http://127.0.0.1:8020",
      "http://localhost:8020",
      "https://csb-7mtmf.netlify.app/",
      "http://localhost:1234"
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", '*');
    }
    */
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    var body = "";
    req.on("data", function (chunk) {
      body += chunk;
    });
    req.on("end", function () {
      console.log(body);
      let b = decodeURIComponent(body);
      if (b.length > 0) {
        var url_string = "http://www.example.com?" + b; //window.location.href
        var url = new URL(url_string);
        let fp = url.searchParams.get("fp"),
          ss = url.searchParams.get("ss"),
          table = url.searchParams.get("table"),
          type = url.searchParams.get("type"),
          from = url.searchParams.get("from"),
          row = url.searchParams.get("row"),
          col = url.searchParams.get("col"),
          del_len = url.searchParams.get("del_len"),
          url_data = b.substring(
            b.indexOf("&data") + 6,
            b.indexOf("&data_len")
          );
        console.log(
          b.substring(b.indexOf("&data") + 6, b.indexOf("&data_len"))
        );
        if (
          b.substring(b.indexOf("&data") + 6, b.indexOf("&data") + 7) == `"`
        ) {
          url_data = b.substring(
            b.indexOf("&data") + 7,
            b.indexOf("&data_len") - 1
          );
        }

        // writeFile function with filename, content and callback function
        if (type == "save") {
          try {
            (async () => {
              await fs.writeFile(fp + table + `.txt`, url_data, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(b);
                  //console.log("POSTed: " + b);
                }
                res.writeHead(200);
                res.end();
              });
            })();
          } catch (err) {
            console.error(err);
          }
        } else if (type == "get") {
          try {
            let d = fs.readFileSync(fp + table + `.txt`, "utf8");
            res.writeHead(200);
            res.end(d);
            console.log(d);
          } catch (err) {
            console.error(err);
          }
        } else if (type == "select") {
          try {
            console.log(url_data);
            let d = JSON.parse(fs.readFileSync(fp + "mf_data.txt", "utf8"));
            console.log(d[table]);
            res.writeHead(200);
            res.end(JSON.stringify(d[table]));
          } catch (err) {
            console.error(err);
          }
        } else if (type == "update") {
          console.log(url_data);
          let d = JSON.parse(fs.readFileSync(fp + "mf_data.txt", "utf8"));

          d[table].table_data[row][col] = url_data;
          try {
            (async () => {
              await fs.writeFile(
                fp + "mf_data" + `.txt`,
                JSON.stringify(d),
                function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(b);
                  }
                  res.writeHead(200);
                  res.end();
                }
              );
            })();
            //console.log(d[table].table_data[row][col]);
          } catch (err) {
            console.log(err);
            res.end(err);
          }
        } else if (type == "insert") {
          console.log(url_data);
          let d = JSON.parse(fs.readFileSync(fp + "mf_data.txt", "utf8"));
          d[table].table_data.splice(row, 0, JSON.parse(url_data));

          try {
            (async () => {
              await fs.writeFile(
                fp + "mf_data" + `.txt`,
                JSON.stringify(d),
                function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(b);
                  }
                  res.writeHead(200);
                  res.end();
                }
              );
            })();
            //console.log(d[table].table_data[row][col]);
          } catch (err) {
            console.log(err);
            res.end(err);
          }
        } else if (type == "delete") {
          console.log(url_data);
          let d = JSON.parse(fs.readFileSync(fp + "mf_data.txt", "utf8"));
          d[table].table_data.splice(row, del_len);
          for (let j = 0; j < d[table].table_data.length; j++) {
            d[table].table_data[j][0] = j;
          }
          try {
            (async () => {
              await fs.writeFile(
                fp + "mf_data" + `.txt`,
                JSON.stringify(d),
                function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(b);
                  }
                  res.writeHead(200);
                  res.end();
                }
              );
            })();
            //console.log(d[table].table_data[row][col]);
          } catch (err) {
            console.log(err);
            res.end(err);
          }
        } else if (type == "new") {
          console.log(url_data);
          let d = JSON.parse(fs.readFileSync(fp + "mf_data.txt", "utf8"));
          d[table] = JSON.parse(url_data);

          try {
            (async () => {
              await fs.writeFile(
                fp + "mf_data" + `.txt`,
                JSON.stringify(d),
                function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(b);
                  }
                  res.writeHead(200);
                  res.end();
                }
              );
            })();
            //console.log(d[table].table_data[row][col]);
          } catch (err) {
            console.log(err);
            res.end(err);
          }
        }
      } else {
        res.writeHead(200);
        res.end();
      }
    });
  })
  .listen(8080);
/*
var file_data = {};
readFiles(
  "/",
  function (filename, content) {
    file_data[filename] = content;
    console.log(file_data);
  },
  function (err) {
    throw err;
  }
);
*/
function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function (filename) {
      fs.readFile(dirname + filename, "utf-8", function (err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}
