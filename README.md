# IMDB_Clone_BE
Install necessary modules using - 
```
npm i --s express express-handlebars mongoose body-parser
npm i mysql
```
To run use:
```
nodemon script.js
```


# Database Setup Script:
```
Create Database IMDB
use IMDB;

CREATE TABLE Producer(
    ID int NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    Gender varchar(10),
    DOB DATE,
    Bio varchar(255),
    PRIMARY KEY (ID)
);

CREATE TABLE Actor(
    ID int NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    Gender varchar(10),
    DOB DATE,
    Bio varchar(255),
    PRIMARY KEY (ID)
);

CREATE TABLE Movies(
    ID int NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    YearOfRelease int,
    Plot varchar(255),
    Poster varchar(255),
    ProducerId int NOT NULL,
    PRIMARY KEY (ID),
	FOREIGN KEY (ProducerId) REFERENCES Producer(ID)
);

CREATE TABLE movieDetails(
MovieId int Not Null,
ActorId int Not Null,
CONSTRAINT Movie_actor UNIQUE(MovieId, ActorId),
foreign key (ActorId) references Actor(ID),
foreign key (MovieId) references Movies(ID)
);

INSERT INTO Producer(Name, Gender, DOB, BIO) values('Frank Darabont','Male','1960-10-10','Three-time Oscar nominee Frank Darabont');
INSERT INTO Producer(Name, Gender, DOB, BIO) values('Francis Ford Coppola','Male','1976-09-10','Two-time Oscar nominee Frank Darabont');
INSERT INTO Producer(Name, Gender, DOB, BIO) values('Christopher Nolan','Male','1980-01-10','Six-time Oscar nominee Frank Darabont');
INSERT INTO Producer(Name, Gender, DOB, BIO) values('Sidney Lumet','Male','1920-11-11','Oscar winner');

INSERT INTO Actor(Name, Gender, DOB, BIO) values('Henry Fonda','Male','1960-10-10','This remarkable, soft-spoken American began in films as a diffident juvenile. ');
INSERT INTO Actor(Name, Gender, DOB, BIO) values('Lee J. Cobb','Male','1920-08-08','Lee J. Cobb, one of the premier character actors in American film for three decades');
INSERT INTO Actor(Name, Gender, DOB, BIO) values('Martin Balsam','Male','1935-08-07','Martin Henry Balsam was born on November 4, 1919 in the Bronx, New York City');

select * from actor;
select * from producer;

INSERT INTO Movies(Name, YearOfRelease, Plot, ProducerId) values('The Shawshank Redemption',1994,'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',1);
INSERT INTO Movies(Name, YearOfRelease, Plot, ProducerId) values('The Godfather',1990,'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.',2);
INSERT INTO Movies(Name, YearOfRelease, Plot, ProducerId) values('The Dark Knight',2008,'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',3);
INSERT INTO Movies(Name, YearOfRelease, Plot, ProducerId) values('The Godfather: Part II',1974,'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',4);

INSERT INTO movieDetails values(1,1);
INSERT INTO movieDetails values(1,2);
INSERT INTO movieDetails values(2,2);
INSERT INTO movieDetails values(2,3);
INSERT INTO movieDetails values(3,1);
INSERT INTO movieDetails values(3,3);
INSERT INTO movieDetails values(4,1);

select * from movieDetails;
```

# Stored Procedures
## Get All Movies
```
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllMovies`()
BEGIN
	select m.ID, m.Name, m.yearOfRelease, m.plot, m.poster, 
    p.name as producerName, 
    a.name as actorName from movies m 
	inner join producer p on p.ID = m.producerId
	inner join movieDetails md on md.movieId = m.Id
	left join actor a on a.Id = md.actorId ;
END
```

## Get Movie By Id
```
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetMovieById`(
IN movieId int
)
BEGIN
select m.ID, m.Name, m.yearOfRelease, m.plot, m.poster, 
    p.name as producerName, 
    a.name as actorName from movies m 
	inner join producer p on p.ID = m.producerId
	inner join movieDetails md on md.movieId = m.Id
	left join actor a on a.Id = md.actorId 
    where m.ID = movieId;
END
```

## Insert Movies
```
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertMovies`(
IN _Name varchar(255),
IN _YearOfRelease int,
IN _Plot varchar(255),
IN _Poster varchar(255),
In _ProducerId int
)
BEGIN
	Declare movieId int;

	Insert into Movies(Name, YearOfRelease, Plot, Poster, ProducerId)
    values(_Name, _YearOfRelease, _Plot, _Poster, _ProducerId);
    
    set movieId = last_insert_id();
    select movieId as 'movieId';
    
END
```

## Insert Movie Details(Relationship with actors)
```
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertMovieDetails`(
In _id int,
In _actorId int
)
BEGIN
	Insert into movieDetails values(_id,_actorId);
END
```

## Insert Actor
```
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertActor`(
In _Name varchar(255),
In _Gender varchar(255),
In _DOB Date,
In _Bio varchar(255)
)
BEGIN
	Declare actorId int;

	INSERT INTO Actor(Name, Gender, DOB, BIO) 
	values(_Name, _Gender, _DOB, _Bio);
    
	set actorId = last_insert_id();
    select actorId as 'actorId';

END
```

## Insert Producer
```
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertProducer`(
In _Name varchar(255),
In _Gender varchar(255),
In _DOB Date,
In _Bio varchar(255)
)
BEGIN
	Declare producerId int;

	INSERT INTO Producer(Name, Gender, DOB, BIO) 
	values(_Name, _Gender, _DOB, _Bio);
    
	set producerId = last_insert_id();
    select producerId as 'producerId';

END
```

## Edit Movies
```
CREATE DEFINER=`root`@`localhost` PROCEDURE `EditMovies`(
In _Id int,
IN _Name varchar(255),
IN _YearOfRelease int,
IN _Plot varchar(255),
IN _Poster varchar(255)
)
BEGIN
	Update Movies set Name = _Name, 
    YearOfRelease = _YearOfRelease, 
    Plot = _Plot,
    Poster = _Poster
    where ID = _Id;
    
    select * from Movies where ID = _Id;
END
```
