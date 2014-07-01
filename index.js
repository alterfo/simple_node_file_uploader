var fs = require('fs'),
    http = require('http'),
    connect = require('connect');

var upload_folder = __dirname + "/uploads/"

var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('app'))
    .use(connect.json())
    .use(connect.urlencoded())
    .use(function(req, res) {
        if (req.method.toUpperCase() == "POST" && req.url == "/upload") {
            var newFile = fs.createWriteStream(upload_folder + req.headers.x_filename);
            var fileBytes = req.headers['content-length'];
            var uploadedBytes = 0;

            req.pipe(newFile);
            console.log("started uploading " + req.headers.x_filename);
            req.on('data', function(chunk) {
                uploadedBytes += chunk.length;
                var progress = (uploadedBytes / fileBytes) * 100;
                console.log("progress: " + parseInt(progress) + "%");
            });
            req.on("end", function() {
                res.writeHead(200);
                res.end("done!");
            })
        }
    });
http.createServer(app).listen(8080, function() {
    console.log("listening on 8080");
});
