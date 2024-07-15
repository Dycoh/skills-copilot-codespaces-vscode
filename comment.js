// create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// create web server
http.createServer(function(request, response) {
    // get URL
    var pathname = url.parse(request.url).pathname;

    // get query
    var query = url.parse(request.url, true).query;

    // get method
    var method = request.method;

    if(method == 'GET') {
        if(pathname == '/') {
            fs.readFile('comment.html', 'utf8', function(error, data) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(data);
            });
        } else if(pathname == '/comment') {
            fs.readFile('comment.json', 'utf8', function(error, data) {
                response.writeHead(200, {'Content-Type': 'text/json'});
                response.end(data);
            });
        }
    } else if(method == 'POST') {
        if(pathname == '/comment') {
            var body = '';

            request.on('data', function(data) {
                body += data;
            });

            request.on('end', function() {
                var post = qs.parse(body);

                fs.readFile('comment.json', 'utf8', function(error, data) {
                    var comments = JSON.parse(data || '[]');

                    comments.push(post);

                    fs.writeFile('comment.json', JSON.stringify(comments), function(error) {
                        response.writeHead(200, {'Content-Type': 'text/json'});
                        response.end(JSON.stringify(comments));
                    });
                });
            });
        }
    }
}).listen(52273, function() {
    console.log('Server Running at http://:52273')
});