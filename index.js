var Hapi    = require('hapi');
var path    = require('path');
var cfenv   = require('cfenv');

var appEnv = cfenv.getAppEnv();

var server = new Hapi.Server({
  debug: {
    request: ['error']
  }
});

server.connection({
  port: appEnv.port
});

var cloudant = require('cloudant')({
  account:"d1c68986-45ea-41eb-abe1-5f804ad60e79-bluemix",
  key:"lyintonsweremandsomeache",
  password:"Fl1Ux5pF4xeRPffJLSrfHlE0"
});

var covendb = cloudant.db.use('coven');

var version = "bluemix";

var providers = {};
if(version === "bluemix"){
  providers = {
    global : {
      isSecure : false,
      password : "test"
    },
    facebook : { clientId: '1619426405008942', clientSecret: '5593ce3a715f5d38f0a53fae90c68663', index : "accounts.facebook" },
    google : { clientId: '709686749465-i1qfr8cnna304crrooanas19gtp77unj.apps.googleusercontent.com', clientSecret: 'Oif_YWozjCX9BlVpVX-Fyn9a', index : "accounts.google" },
    twitter : { clientId: 'La0eZ6RRp9c5kLA06HB8Q6rlT', clientSecret: 'HpOM1cjEgqasJQLQ4eP8z0npVtLhAFYMN5vMg7U9FVerRQYOge', index : "accounts.twitter" },
    linkedin : { clientId: '77cug90hzjd6vq', clientSecret: '7F55FVVYLTSiITvd', index : "accounts.linkedin" }
  };
}else{
  providers = {
    global : {
      isSecure : false,
      password : "test"
    },
    facebook : { clientId: '1619426405008942', clientSecret: '5593ce3a715f5d38f0a53fae90c68663', index : "accounts.facebook" },
    google : { clientId: '709686749465-uvedsdrcjgdnakd1nvlu6suurc1g341i.apps.googleusercontent.com', clientSecret: 'CJ9BW_pHaCr784JdcoB6gZDG', index : "accounts.google" },
    twitter : { clientId: 'hyEJaiWnL16J7lalWo5oMZVh9', clientSecret: 'iUfuFT91qAjwjprZvJvNZDFdjqHutS6F2xKpdzC9iNwwvOu1g8', index : "accounts.twitter" },
    linkedin : { clientId: '77cug90hzjd6vq', clientSecret: '7F55FVVYLTSiITvd', index : "accounts.linkedin" }
  }
}

var maxwho = require("maxwho")({
  db : {
    db_obj : covendb,
    indexes : ["accounts.facebook", "accounts.google", "accounts.twitter", "accounts.linkedin", "email"]
  },
  hapi_server : server,
  bell : require('bell'),
  session : require('hapi-auth-cookie'),
  providers : providers,
  cookie : {
    name : "coven-cookie",
    password : "secret"
  },
  routes : {
    register : "/register",
    login : "/login",
    main : "/"
  }
});

server.views({
  engines: {
    jsx: require('hapi-react-views')
  },
  relativeTo : __dirname,
  path: './views'
});

//static routes
server.route({
  method: 'GET',
  path: '/css/{param*}',
  handler: {
    directory: {
      path: './example/static/css'
    }
  }
});

server.route({
  method: 'GET',
  path: '/fonts/{param*}',
  handler: {
    directory: {
      path: './example/static/fonts'
    }
  }
});

server.route({
  method: 'GET',
  path: '/js/{param*}',
  handler: {
    directory: {
      path: './example/static/js'
    }
  }
});

//registration handling route
server.route({
  method: ['POST'],
  path: '/register-handler',
  config: {
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: function(request, reply){
      if (request.auth.isAuthenticated && request.auth.credentials.dummy === undefined) {
        return reply.redirect('/');
      }

      maxwho.reg(request.auth.session, {
        email : request.payload.email,
        password : request.payload.password,
        name : {
          first : request.payload.firstname,
          last : request.payload.lastname
        },
        phone : request.payload.phone,
        accounts : request.auth.isAuthenticated ? request.auth.credentials.accounts : {}
      }, function(result){
        reply(JSON.stringify(result));
      });
    }
  }
});

//register page route
server.route({
  method: ['GET'],
  path: '/register',
  config: {
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: function (request, reply) {
      if (request.auth.isAuthenticated && request.auth.credentials.dummy === undefined) {
        return reply.redirect('/');
      }

      var profile = request.auth.credentials;

      var data = {
        title : "Register your MaxWhere account!"
      };

      if(profile != null){
        data.email = profile.email;
        data.firstname = profile.name.first;
        data.lastname = profile.name.last;
      }

      return reply.view('register',data)
      .header('Cache-Control', 'private, max-age=0, no-cache, no-store, must-revalidate')
      .header('Expires', '-1')
      .header('Pragma', 'no-cache');
    }
  }
});

//login handling route
server.route({
  method: ['POST'],
  path: '/login-handler',
  config: {
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: function(request, reply){
      if(request.auth.isAuthenticated){
        return reply.redirect('/');
      }

      maxwho.login(request.auth.session, {
        email : request.payload.email,
        password : request.payload.password
      }, function(result){
        reply(JSON.stringify(result));
      });
    }
  }
});

server.route({
  method: ['GET'],
  path: '/login',
  config: {
    auth: {
      mode: 'try',
      strategy: 'session'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: function (request, reply) {
      if (request.auth.isAuthenticated && request.auth.credentials.dummy === undefined) {
        return reply.redirect('/');
      }

      return reply.view('login',{
        title : "Log in to MaxWhere!"
      })
      .header('Cache-Control', 'private, max-age=0, no-cache, no-store, must-revalidate')
      .header('Expires', '-1')
      .header('Pragma', 'no-cache');
    }
  }
});

server.route({
  method: ['GET'],
  path: '/logout',
  config: {
    handler: function (request, reply) {
      request.auth.session.clear();
      return reply.redirect('/login');
    }
  }
});

server.route({
  method: ['GET'],
  path: '/',
  config: {
    auth: 'session',
    handler: function (request, reply) {
      var profile = request.auth.credentials;

      if(profile.dummy !== undefined){
        request.auth.session.clear();
        return reply.redirect('/login');
      }

      var data = {
        title : "Welcome to MaxWhere!",
        name : profile.name,
        email : profile.email,
        facebook : profile.accounts.facebook === undefined ? true : false,
        google : profile.accounts.google === undefined ? true : false,
        twitter : profile.accounts.twitter === undefined ? true : false,
        linkedin : profile.accounts.linkedin === undefined ? true : false
      };

      return reply.view('main', data)
      .header('Cache-Control', 'private, max-age=0, no-cache, no-store, must-revalidate')
      .header('Expires', '-1')
      .header('Pragma', 'no-cache');
    }
  }
});

server.start(function () {
  console.log('[SERVER] Starting at ', server.info.uri);
});
