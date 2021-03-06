var formidable = require('formidable');
var util = require('util');
var crypto = require('crypto');
var Cookies = require( "cookies" )
var keygrip = require("keygrip")
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var nodemailer = require('nodemailer');
var url = require('url');
var smtpTransport = require('nodemailer-smtp-transport');

var mongoUri = process.env.MONGOHQ_URL || 'mongodb://127.0.0.1:27017/health-database';
var fromEmail = process.env.FROM_EMAIL || 'tempexp6@gmail.com';
var fromPassword = process.env.FROM_PASSWORD || 'TempExp@06';
var url = require('url');

var keys = keygrip([ process.env.COOKIESECRET1 || "COOKIESECRET1", process.env.COOKIESECRET2 || "COOKIESECRET2" ], 'sha256', 'hex');

function checkUser(req, res) {
    var url_parts = url.parse(req.url, true);
    console.log(url_parts);
    if(url_parts.query.email == null) {
        // Not Acceptable format
        res.writeHead(406, {'Content-Type': 'application/json'});
        console.log(JSON.stringify({error: true, databaseError: false, user: null, description: 'email-missing'}));
        res.end(JSON.stringify({error: true, databaseError: false, user: null, description: 'email-missing'}));
    } else {
        // Connecting to database
        MongoClient.connect(mongoUri, function(err, db) {
            if(err) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                console.log(JSON.stringify({error: true, databaseError: true, user: null, description: 'database-connection-error'}));
                res.end(JSON.stringify({error: true, databaseError: true, user: null, description: 'database-connection-error'}));
                db.close();
            } else {
                var collection = db.collection('users');
                collection.findOne({email: url_parts.query.email}, function(err, result) {
                    if(err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        console.log(JSON.stringify({error: true, databaseError: true, user: null, description: 'database-find-error'}));
                        res.end(JSON.stringify({error: true, databaseError: true, user: null, description: 'database-find-error'}));
                                db.close();
                    } else {
                        if(result == null) {
                            // user not found
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            console.log(JSON.stringify({error: true, databaseError: false, user: null, description: 'user-nonexistent'}));
                            res.end(JSON.stringify({error: true, databaseError: false, user: null, description: 'user-nonexistent'}));
                            db.close();
                        } else {
                            // User already registered
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            console.log(JSON.stringify({error: false, databaseError: false, user: result.email, description: 'user-found'}));
                            res.end(JSON.stringify({error: false, databaseError: false, user: result.email, description: 'user-found'}));
                            db.close();
                        }
                    }
                });
            }
        });
    }
}

function resgisterAppUser(req, res) {
    var url_parts = url.parse(req.url, true);
    console.log(url_parts);
    if(url_parts.query.email == null || url_parts.query.name == null || url_parts.query.gender == null || url_parts.query.password == null) {
        // Not Acceptable format
                res.writeHead(406, {'Content-Type': 'application/json'});
                console.log(JSON.stringify({error: true, databaseError: false, user: null, description: 'information-missing'}));
                res.end(JSON.stringify({error: true, databaseError: false, user: null, description: 'information-missing'}));
    } else {
        // Connecting to database
        MongoClient.connect(mongoUri, function(err, db) {
            if(err) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                console.log(JSON.stringify({error: true, databaseError: true, user: null, description: 'database-connection-error'}));
                res.end(JSON.stringify({error: true, databaseError: true, user: null, description: 'database-connection-error'}));
                db.close();
            } else {
                // TODO: Has to take HASH of password before saving
                var collection = db.collection('users');
                collection.insert({email: url_parts.query.email, name: url_parts.query.name, gender: url_parts.query.gender, password: url_parts.query.password}, function(err, result) {
                    if(err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        console.log(JSON.stringify({error: true, databaseError: true, user: null, description: 'database-find-error'}));
                        res.end(JSON.stringify({error: true, databaseError: true, user: null, description: 'database-find-error'}));
                        db.close();
                    } else {
                        if(result == null) {
                            // user wasn't registrered
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            console.log(JSON.stringify({error: true, databaseError: false, user: null, description: 'user-not-registered'}));
                            res.end(JSON.stringify({error: true, databaseError: false, user: null, description: 'user-not-registered'}));
                            db.close();
                        } else {
                            // User successfully registered
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            console.log(JSON.stringify({error: false, databaseError: false, user: result.email, description: 'user-registered'}));
                            res.end(JSON.stringify({error: false, databaseError: false, user: result.email, description: 'user-registered'}));
                            db.close();
                        }
                    }
                });
            }
        });
    }
}

function articleList(req, res) {
    console.log("articleList got called");
    articles = {articles: [
        {category: 'dummy', title: 'Article1', link: 'http://ishanatmuz.wordpress.com/'},
        {category: 'dummy', title: 'Article2', link: 'https://github.com/ishanatmuz/'},
        {category: 'dummy', title: 'Article3', link: 'http://ishanatmuz.wordpress.com/'},
        {category: 'dummy', title: 'Article4', link: 'https://github.com/ishanatmuz/'},
        {category: 'dummy', title: 'Article5', link: 'http://ishanatmuz.wordpress.com/'},
        {category: 'dummy', title: 'Article6', link: 'http://ishanatmuz.wordpress.com/'},
        {category: 'dummy', title: 'Article7', link: 'https://github.com/ishanatmuz/'},
        {category: 'dummy', title: 'Article8', link: 'http://ishanatmuz.wordpress.com/'},
        {category: 'dummy', title: 'Article9', link: 'http://ishanatmuz.wordpress.com/'},
        {category: 'dummy', title: 'Article10', link: 'http://ishanatmuz.wordpress.com/'},
    ]}
//    res.writeHead(200, {'Content-Type': 'text/json'});
//    res.end(JSON.stringify(dummyArticles));
    MongoClient.connect(mongoUri, function(err, db) {
        if(err) {
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.end(JSON.stringify(articles));
        } else {
            var collection = db.collection('articles');
            collection.find().limit(20).toArray(function(err, items) {
                if(err) {
                    res.writeHead(200, {'Content-Type': 'text/json'});
                    res.end(JSON.stringify(articles));
                    db.close();
                } else {
                    articles.articles = items;
                    console.dir(articles);
                    res.writeHead(200, {'Content-Type': 'text/json'});
                    res.end(JSON.stringify(articles));
                    db.close();
                }
            });
        }
    });
}

exports.checkUser = checkUser;
exports.registerAppUser = resgisterAppUser;
exports.articleList = articleList;
