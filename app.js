var http = require('http');
var url = require('url');
var nodeStatic = require('node-static');
var staticServer = new(nodeStatic.Server)();
var wurl = require('wurl');

var port = Number(process.env.PORT || 8080);
var viewHandlers = require('./viewHandlers');
var loginHandler = require('./loginHandler');
var appHandler = require('./appHandler');

http.createServer(function (req, res) {
//    var urlInfo  = url.parse(req.url, true, true);
//    console.log(urlInfo.path);
//    var firstLocation = urlInfo.path.split('/')[1];
//    firstLocation = firstLocation.split('?')[0];
//    console.log('FirstLocation');
    var firstLocation = wurl(1, req.url);
    console.log(firstLocation);
    
    
    // Serving CSS, JS, Images and favicon
    if(firstLocation === 'css' || firstLocation === 'js' || firstLocation === 'img' || firstLocation === 'favicon.ico' || firstLocation === 'fonts') {
//        console.log("CSS, JS or favicon.ico; needed static hosting");
        staticServer.serve(req, res);
    } else {
        switch(firstLocation) {
                // Index page
                case '':
                case 'index':
                    viewHandlers.index(req, res);
                break;
                case 'loginLocal':
                    loginHandler.loginLocal(req, res);
                break;
                case 'dashboard':
                    viewHandlers.dashboard(req, res);
                break;
                case 'logout':
                    loginHandler.logout(req, res);
                break;
                case 'logoutothers':
                    loginHandler.logoutOthers(req, res);
                break;
                case 'register':
                    loginHandler.register(req, res);
                break;
                case 'registeruser':
                    loginHandler.registeruser(req, res);
                break;
                case 'confirmUser':
                    loginHandler.confirmUser(req, res);
                break;
                case 'profile':
                    viewHandlers.profile(req, res);
                break;
                case 'uploadImage':
                    viewHandlers.uploadImage(req, res);
                break;
                case 'checkUser':
                    appHandler.checkUser(req, res);
                break;
                case 'registerAppUser':
                    appHandler.registerAppUser(req, res);
                break;
                case 'articleList':
                    appHandler.articleList(req, res);
                break;
                default:
                    viewHandlers.notFound(req, res);
        }
    }
}).listen(port);

console.log('Server running on port : ' + port);