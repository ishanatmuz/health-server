var fs = require('fs');
var mustache = require('mustache');
var loginHandler = require('./loginHandler');
var formidable = require('formidable');

// Request handling for Views

// Index Handling
function index(req, res) {
    // Checking if the user is already logged in to redirect
    loginHandler.ensureAuthenticated(req, res, function(userEmail) {
        if(userEmail) {
            res.writeHead(302, {'Location': '/dashboard'});
            res.end();
        } else {
            // Serving the index file
            fs.readFile('views/index.html', {'encoding': 'utf-8'}, function (err, data) {
                if (err) {
                    console.log('Error occurred while reading');
                    res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                    res.write('There was an internal error on the server.\nPlease try again at a later time, or contact the system admins.');
                } else {
    //                console.log('Sending the index page');
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(data);
                    res.end();
                }
            });
        }
    });
}

// Not Found handler
function notFound(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    res.write('We weren\'t able to find ' + req.url + ' on our servers. Are you sure you typed the URL correct ? If yes please contact the admin of this server.');
    res.end();
}

function dashboard(req, res) {
    // Need to ensure authentication using loginHandler
    // We will use loginHandler.ensureAUthenticated for authentication
    loginHandler.ensureAuthenticated(req, res, function(userEmail) {
        // Reqponse based on user authentication
        if(userEmail) {
//            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
//            res.write("<!doctype html><html><head></head><body><h3>Welcome <b>" + userEmail + "</b></h3><br/><br/><a href='/logout'>Logout</a></body></html>");
//            res.end();
            fs.readFile('views/dashboard.html', function(err, template) {
                if(err) {
                    res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8;'});
                    res.end('There was an internal server error.\nSomething is broken :(');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8;'});
                    var data = {
                        useremail: userEmail
                    }
                    res.write(mustache.to_html(template.toString(), data));
                    res.end();
                }
            });
        } else {
            res.writeHead(401, {'ContentType': 'text/html;charset=utf-8', 'WWW-Authenticate': 'email, session'});
            res.write("<html><head></head><body>We couldn't figure out who you are.<br/>For all we know you could be trying to find a vlunerability in our system. Please <a href='/'>Login</a> to continue.</body></html>");
            res.end();
        }
    });
}

function profile(req, res) {
    // Need to ensure authentication using loginHandler
    // We will use loginHandler.ensureAUthenticated for authentication
    loginHandler.ensureAuthenticated(req, res, function(userEmail) {
        // Reqponse based on user authentication
        if(userEmail) {
//            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
//            res.write("<!doctype html><html><head></head><body><h3>Welcome <b>" + userEmail + "</b></h3><br/><br/><a href='/logout'>Logout</a></body></html>");
//            res.end();
            fs.readFile('views/profile.html', function(err, template) {
                if(err) {
                    res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8;'});
                    res.end('There was an internal server error.\nSomething is broken :(');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8;'});
                    var data = {
                        useremail: userEmail,
                        userImage: '/img/' + userEmail
                    }
                    res.write(mustache.to_html(template.toString(), data));
                    res.end();
                }
            });
        } else {
            res.writeHead(401, {'ContentType': 'text/html;charset=utf-8', 'WWW-Authenticate': 'email, session'});
            res.write("<html><head></head><body>We couldn't figure out who you are.<br/>For all we know you could be trying to find a vlunerability in our system. Please <a href='/'>Login</a> to continue.</body></html>");
            res.end();
        }
    });
}

function uploadImage(req, res) {
    // Taking in the info from the incoming form
    var form = new formidable.IncomingForm();
	form.uploadDir = './img';
	form.keepExtensions = true;
	form.hash = 'md5';
    
    // parsing the form using formidable
	form.parse(req, function(error, fields, files) {
		
		if(typeof(files.upload) === 'undefined') {
            // use http status code 400 for form not sent
            console.log('called without a form');
            response.writeHead(400, {'content-type': 'text/plain'});
            response.write("400 Bad Request :\nThe request has been made without sending a proper form.");
            response.end();
		} else {
            // Setting content.path and content.type to return
            console.log('File uploaded successfully at ' + files.upload.path + ' of type ' + files.upload.type);
            res.writeHead(200, {'content-type': 'text/plain'});
            res.end(files.upload.path);
        }
    });
}

exports.index = index;
exports.notFound = notFound;
exports.dashboard = dashboard;
exports.profile = profile;
exports.uploadImage = uploadImage;