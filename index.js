var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose = require("mongoose");
var passport = require("passport");
const cookieSession = require('cookie-session');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var localstrategy = require("passport-local")
var User = require("./models/user")
var User1 = require("./models/user1")
var regex = require("regex");
mongoose.connect("mongodb://localhost:27017/camp", { useNewUrlParser: true });
app.use(express.static("public"));
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere']
}));

app.use(require("express-session")({
    secret: "fraands",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));

passport.use(new GoogleStrategy({
        clientID: '591887805779-d09c5k8lavcoi2r84dakjmug2lf5bsgd.apps.googleusercontent.com',

        clientSecret: 'KIougq_YukOeLPsBT8qEa-e6',
        callbackURL: "http://localhost:3000/auth/google/redirect",

    }, function(accessToken, refreshToken, profile, done) {
        console.log('callback fired');


        new User1({
            username: profile.displayName,
            googleId: profile.id
        }).save().then((newUser1) => {
            console.log('new user created' + newUser1);
        });
        return done(null, profile);
    }

));
passport.serializeUser((user, done) => {
    done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.set("view engine", "ejs");

var picsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    video: String,
    rating: String,
    screenshot: String,
    genre: String,
    date: String,
    dlink: String,
    tlink: String,
    slink: String,
    category: String


});

var feedbacksSchema = new mongoose.Schema({
    name: String,
    email: String,
    feedback: String
});

var feedbacks = mongoose.model("feedbacks", feedbacksSchema)

var pics = mongoose.model("pics", picsSchema);

// app.get("/", function(req,res){
//     pics.find({},function(err,pics){
//         if(err){
//             console.log(err);
//         }else
//         {
//             res.render("shivam",{pics:pics});
//         }
//     })

// });

app.post("/t", function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var feedback = req.body.feedback;

    var feed = {
        name: name,
        email: email,
        feedback: feedback

    };
    feedbacks.create(feed, function(err, feed) {

        if (err) {
            console.log(err);

        } else {
            res.redirect("/");
        }

    });
});

app.get("/", function(req, res) {

    pics.find({}, function(err, pics) {
        if (err) {
            console.log(err);
        } else {
            res.render("shivam", { pics: pics });

        }

    });
});



app.post("/", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var category = req.body.category
    var description = req.body.description
    var video = req.body.video
    var rating = req.body.rating
    var screenshot = req.body.screenshot
    var genre = req.body.genre
    var date = req.body.date
    var dlink = req.body.dlink
    var tlink = req.body.tlink
    var slink = req.body.slink


    var newCampground = {
        name: name,
        image: image,
        category: category,
        description: description,
        video: video,
        rating: rating,
        screenshot: screenshot,
        genre: genre,
        date: date,
        dlink: dlink,
        tlink: tlink,
        slink: slink

    };
    pics.create(newCampground, function(err, newlyCampground) {
        if (err) {
            console.log(err);

        } else {
            res.redirect("/");
        }
    });
});

// app.get("/next", function(req, res) {
//     smartphones.findById("5e12d86186d564bd4487658c", function(err, result) {
//         if (err) {
//             res.send(err);
//         } else {
//             res.render("next");
//         }
//     });
// });

app.get('/next/:name', (req, res) => {


    pics.find({
            name: req.params.name
        },
        function(err, pics) {
            if (err) throw err;
            res.render("next", { pics: pics });
        });


});
app.get('/search/', function(req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');


        pics.find({
            name: regex
        }, function(err, pics) {
            if (err) {
                console.log(err);

            } else {
                res.render("search", { pics: pics });
            }
        });
    } else {
        res.send("No Result Found")
    }
});

app.get('/s/', function(req, res) {
    if (req.query.genre) {
        const regex = new RegExp(escapeRegex(req.query.genre), 'gi');


        pics.find({

            genre: regex
        }, function(err, pics) {
            if (err) {
                console.log(err);

            } else {
                res.render("genre", { pics: pics });
            }
        });
    } else {
        res.send("No Result Found")
    }
});

app.get('/c/', function(req, res) {
    if (req.query.category) {
        const regex = new RegExp(escapeRegex(req.query.category), 'gi');


        pics.find({

            category: regex
        }, function(err, pics) {
            if (err) {
                console.log(err);

            } else {
                res.render("category", { pics: pics });
            }
        });
    } else {
        res.send("No Result Found")
    }
});

app.get('/r/', function(req, res) {

    var mysort = { rating: -1 };
    pics.find({}).sort(mysort).exec(function(err, pics) {
        if (err) {
            console.log(err);

        } else {
            res.render("rating", { pics: pics });
        }
    });

});

app.get('/l/', function(req, res) {

    var mysort = { date: -1 };
    pics.find({}).sort(mysort).exec(function(err, pics) {
        if (err) {
            console.log(err);

        } else {
            res.render("latest", { pics: pics });
        }
    });

});


app.get("/newpics", function(req, res) {
    res.render("new.ejs")
});
//auth routes
app.get("/register", function(req, res) {
    res.render("register")
});
app.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
            if (err) {
                console.log(err);
                return res.render("register")
            }
            passport.authenticate("local")(req, res, function() {
                res.redirect("/")
            })
        })
        //   User.register(neweUser,req.body.password)
});

app.get("/login", function(req, res) {
    res.render("login")
});

app.get("/shit", function(req, res) {
    res.render("shit")
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/gallery",
    failureRedirect: "/shit"
}), function(req, res) {

});
app.get("/logout", function(req, res) {






    res.logout();
    res.redirect("/gallery")

});

app.get("/google", passport.authenticate("google", {

    scope: ['https://www.googleapis.com/auth/plus.login', , 'https://www.googleapis.com/auth/plus.profile.emails.read']
}));
app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/gallery");
    });
app.get('/auth/google/redirect',
    passport.authenticate('google', {
        successRedirect: '/gallery',
        failureRedirect: '/auth/google/failure'
    }));

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen( 5000, process.env.IP,function() {
    console.log("Server has Started.......Enjoy (•‿•)");
});
