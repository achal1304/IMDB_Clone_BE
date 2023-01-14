const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const res = require('express/lib/response');

var app = express();
app.use(cors());
//Configuring express server
app.use(bodyparser.json());

//MySQL details
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Admin@123',
    database: 'IMDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

//Router to Get movie details
app.get('/movies', (req, res) => {
    let learner = req.body;
    var sql = "CALL GetAllMovies(); ";
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Router to Get movie details by id
app.get('/movies/:id', (req, res) => {
    let learner = req.body;
    var sql = "set @movieId = ?; CALL GetMovieById(@movieId); ";
    mysqlConnection.query(sql, [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


//Router to INSERT/POST a movie's detail
app.post('/movies', (req, res) => {
    let movie = req.body;
    console.log("movie", movie);
    let movieId = 0;
    var sql = "SET @_Name = ?;SET @_YearOfRelease = ?;SET @_Plot = ?;SET @_Poster = ?;SET @_ProducerId = ?; CALL InsertMovies(@_Name,@_YearOfRelease,@_Plot,@_Poster,@_ProducerId);";
    mysqlConnection.query(sql, [movie.name, movie.yearOfRelease, movie.plot, movie.poster, movie.producerId], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    movieId = element[0].movieId;
                }
            });
            var sql2 = "SET @_id = ?; SET @_actorId = ?; CALL InsertMovieDetails(@_id, @_actorId);"
            var error = '';
            movie.actors.forEach((element => {
                mysqlConnection.query(sql2, [movieId, element], (err, rows, fields) => {
                    if (err)
                        error = err.code;
                })
            }))
            console.log(error);
            if (error == "") {
                res.send(movieId.toString())
            } else {
                console.log(error);
            }
        }
        else
            console.log(err);
    })
});

//Router to UPDATE/PUT movie details
app.put('/editmovie', (req, res) => {
    let movie = req.body;
    console.log("movie", movie);
    let movieId = 0;
    var sql = "SET @Id = ?;SET @_Name = ?;SET @_YearOfRelease = ?;SET @_Plot = ?;SET @_Poster = ?; CALL EditMovies(@Id,@_Name,@_YearOfRelease,@_Plot,@_Poster);";
    mysqlConnection.query(sql, [movie.id, movie.name, movie.yearOfRelease, movie.plot, movie.poster], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        }
        else {
            console.log(err);
        }
    });
});

//Router to INSERT/POST a actor's detail
app.post('/actor', (req, res) => {
    let actor = req.body;
    let actorId = 0;
    var sql = "SET @_Name = ?;SET @_Gender = ?;SET @_DOB = ?;SET @_Bio = ?; CALL InsertActor(@_Name,@_Gender,@_DOB,@_Bio);";
    mysqlConnection.query(sql, [actor.name, actor.gender, actor.dob, actor.bio], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    actorId = element[0].actorId;
                }
            });
            res.send(actorId.toString())
        }
        else
            console.log(err);
    })
});

//Router to INSERT/POST a producer's detail
app.post('/producer', (req, res) => {
    let producer = req.body;
    let producerId = 0;
    var sql = "SET @_Name = ?;SET @_Gender = ?;SET @_DOB = ?;SET @_Bio = ?; CALL InsertProducer(@_Name,@_Gender,@_DOB,@_Bio);";
    mysqlConnection.query(sql, [producer.name, producer.gender, producer.dob, producer.bio], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    producerId = element[0].producerId;
                }
            });
            res.send(producerId.toString())
        }
        else
            console.log(err);
    })
});


// Router to Get all actors
app.get('/actors', (req, res) => {
    mysqlConnection.query('SELECT * FROM actor;', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// Router to Get all producers
app.get('/producers', (req, res) => {
    mysqlConnection.query('SELECT * FROM producer;', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});
