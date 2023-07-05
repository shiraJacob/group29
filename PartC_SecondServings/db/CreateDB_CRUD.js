const SQL = require('./db');
const path = require('path'); //in index
const csv = require('csvtojson');


//CREATE TABLES

const CreateTable_Cities = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Cities` (City VARCHAR(255) primary key not null)';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created cities table');
    })
    next();
}

const CreateTable_Hours = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Hours` (Hour VARCHAR(4) primary key not null)';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created hours table');
    })
    next();
}

const CreateTable_Diets = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Diets` (Diet VARCHAR(255) primary key not null )';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created diets table');
    })
    next();
}

const CreateTable_Kosher = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Koshers` (Kosher VARCHAR(255) primary key not null)';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created koshers table');
    })
    next();
}

const CreateTable_Users = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Users` (UserName VARCHAR(255) primary key not null,Password VARCHAR(255) not null,PhoneNumber_user VARCHAR(10) not null,City VARCHAR(255) not null references Cities(City) ,Address VARCHAR(255) not null, RestaurantOwner INT not null)';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created users table');
    })
    next();
}


const CreateTable_Posts = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Posts` (Post_num INT AUTO_INCREMENT PRIMARY KEY, User_share VARCHAR(255) not null references Users(UserName) , Post_date DATE not null, URL_photo  VARCHAR(3000) not null, Title VARCHAR(500) not null, PhoneNumber_post VARCHAR(10) not null, City VARCHAR(255) not null references Cities(City), Address VARCHAR(500) not null, Description VARCHAR(800) , Quantity INT not null, Expiry DATE not null, Hours_from VARCHAR(4) not null references Hours(hour), Hours_to VARCHAR(4) not null references Hours(hour), Amount_available INT not null)';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created posts table');
    })
    next();
}


const CreateTable_Pickups = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Pickups` (Post_num INT not null references Posts(Post_num), User_take VARCHAR(255) not null references Users(UserName),Pickup_dateTime DATETIME not null, primary key (Post_num, User_take, Pickup_dateTime), Amount_taken INT not null)';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created Pickups table');
    })
    next();
}

const CreateTable_Update_amount_left = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Update_amount_left` (Post_num INT not null references Posts(Post_num), User_update VARCHAR(255) not null references Users(UserName),Update_dateTime DATETIME not null, primary key (Post_num, User_update, Update_dateTime), Amount_update INT not null)';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created Update_amount_left table');
    })
    next();
}


const CreateTable_Posts_Kosher = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Posts_Kosher` (Post_num INT not null references Posts(Post_num), Kosher VARCHAR(255) not null references Koshers(Kosher), primary key (Post_num, Kosher))';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created Posts_Kosher table');
    })
    next();
}

const CreateTable_Users_Diet = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Users_Diet` (UserName VARCHAR(255) not null references Users(UserName), Diet VARCHAR(255) not null references Diets(Diet), primary key (UserName, Diet))';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created Users_Diet table');
    })
    next();
}

const CreateTable_Posts_Diet = (req, res, next) => {
    const Q1 = 'CREATE TABLE IF NOT EXISTS `Posts_Diet` (Post_num INT not null references Posts(Post_num), Diet VARCHAR(255) not null references Diets(Diet), primary key (Post_num, Diet))';
    SQL.query(Q1, (err, mySQLres) => {
        if (err) {
            //throw err; //FROM NAAMA
            console.log("error ", err);
            res.status(400).send({ message: "error in creating table" });
            return;
        }
        console.log('created Posts_Diet table');
    })
    next();
}

//INSERT DATA TO TABLES

const InsertData_Cities = (req, res, next) => {
    const Q2 = "INSERT INTO Cities SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Cities.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); 
            jsonObj.forEach(element => {
                var NewEntry = {
                    "City": element.City
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly- Cities ");
                });
            });
        });
    next()
};

const InsertData_Hours = (req, res, next) => {
    const Q2 = "INSERT INTO Hours SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Hours.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "Hour": element.Hour
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly- Hours ");
                });
            });
        });
    next()
};

const InsertData_Diets = (req, res, next) => {
    const Q2 = "INSERT INTO Diets SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Diets.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "Diet": element.Diet
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly-Diets ");
                });
            });
        });
    next()
};

const InsertData_Koshers = (req, res, next) => {
    const Q2 = "INSERT INTO Koshers SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Koshers.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "Kosher": element.Kosher
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly- Koshers ");
                });
            });
        });
    next()
};

const InsertData_Users = (req, res, next) => {
    const Q2 = "INSERT INTO Users SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Users.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "UserName": element.UserName,
                    "Password": element.Password,
                    "PhoneNumber_user": element.PhoneNumber_user,
                    "City": element.City,
                    "Address": element.Address,
                    "RestaurantOwner": element.RestaurantOwner
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly- Users ");
                });
            });
        });
    next()
};


const InsertData_Posts = (req, res, next) => {
    const Q2 = "INSERT INTO Posts SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Posts.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "Post_num": element.Post_num,
                    "User_share": element.User_share,
                    "Post_date": element.Post_date,
                    "URL_photo": element.URL_photo,
                    "Title": element.Title,
                    "PhoneNumber_post": element.PhoneNumber_post,
                    "City": element.City,
                    "Address": element.Address,
                    "Description": element.Description,
                    "Quantity": element.Quantity,
                    "Expiry": element.Expiry,
                    "Hours_from": element.Hours_from,
                    "Hours_to": element.Hours_to,
                    "Amount_available": element.Amount_available
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly- Posts ");
                });
            });
        });
    next()
};


const InsertData_Pickups = (req, res, next) => {
    const Q2 = "INSERT INTO Pickups SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Pickups.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "Post_num": element.Post_num,
                    "User_take": element.User_take,
                    "Pickup_dateTime": element.Pickup_dateTime,
                    "Amount_taken": element.Amount_taken
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly-Pickups ");
                });
            });
        });
    next()
};


const InsertData_Update_amount_left = (req, res, next) => {
    const Q2 = "INSERT INTO Update_amount_left SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Update_amount_left.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "Post_num": element.Post_num,
                    "User_update": element.User_update,
                    "Update_dateTime": element.Update_dateTime,
                    "Amount_update": element.Amount_update
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly-Update_amount_left ");
                });
            });
        });
    next()
};

const InsertData_Posts_Kosher = (req, res, next) => {
    const Q2 = "INSERT INTO Posts_Kosher SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Posts_Kosher.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "Post_num": element.Post_num,
                    "Kosher": element.Kosher
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly-Posts_Kosher ");
                });
            });
        });
    next()
};

const InsertData_Users_Diet = (req, res, next) => {
    const Q2 = "INSERT INTO Users_Diet SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Users_Diet.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "UserName": element.UserName,
                    "Diet": element.Diet
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly-Users_Diet ");
                });
            });
        });
    next()
};

const InsertData_Posts_Diet = (req, res, next) => {
    const Q2 = "INSERT INTO Posts_Diet SET ?";
    const csvFilePath = path.join(__dirname, "/Excel/Posts_Diet.csv");
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            console.log(jsonObj); // for learning perpose
            jsonObj.forEach(element => {
                const NewEntry = {
                    "Post_num": element.Post_num,
                    "Diet": element.Diet
                }
                SQL.query(Q2, NewEntry, (err, mysqlres) => {
                    if (err) {
                        console.log("error in inserting data", err);
                    }
                    console.log("created row sucssefuly- Posts_Diet ");
                });
            });
        });
    next()
};


//SELECT ALL TABLES

const ShowTable_Cities = (req, res) => {
    const query = 'SELECT * FROM Cities';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Cities:', err);
            res.status(400).send({ message: 'error in showing table Cities' });
            return;
        }
        console.log('showing table Cities');
        res.send(result);
    });
};

const ShowTable_Hours = (req, res) => {
    const query = 'SELECT * FROM Hours';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Hours:', err);
            res.status(400).send({ message: 'error in showing table Hours' });
            return;
        }
        console.log('showing table Hours');
        res.send(result);
    });
};

const ShowTable_Diets = (req, res) => {
    const query = 'SELECT * FROM Diets';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Diets:', err);
            res.status(400).send({ message: 'error in showing table Diets' });
            return;
        }
        console.log('showing table Diets');
        res.send(result);
    });
};

const ShowTable_Koshers = (req, res) => {
    const query = 'SELECT * FROM Koshers';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Koshers:', err);
            res.status(400).send({ message: 'error in showing table Koshers' });
            return;
        }
        console.log('showing table Koshers');
        res.send(result);
    });
};

const ShowTable_Users = (req, res) => {
    const query = 'SELECT * FROM Users';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Users:', err);
            res.status(400).send({ message: 'error in showing table Users' });
            return;
        }
        console.log('showing table Users');
        res.send(result);
    });
};

const ShowTable_Posts = (req, res) => {
    const query = 'SELECT * FROM Posts';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Posts:', err);
            res.status(400).send({ message: 'error in showing table Posts' });
            return;
        }
        console.log('showing table Posts');
        res.send(result);
    });
};

const ShowTable_Posts_Kosher = (req, res) => {
    const query = 'SELECT * FROM Posts_Kosher';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Posts_Kosher:', err);
            res.status(400).send({ message: 'error in showing table Posts_Kosher' });
            return;
        }
        console.log('showing table Posts_Kosher');
        res.send(result);
    });
};

const ShowTable_Users_Diet = (req, res) => {
    const query = 'SELECT * FROM Users_Diet';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Users_Diet:', err);
            res.status(400).send({ message: 'error in showing table Users_Diet' });
            return;
        }
        console.log('showing table Users_Diet');
        res.send(result);
    });
};

const ShowTable_Posts_Diet = (req, res) => {
    const query = 'SELECT * FROM Posts_Diet';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Posts_Diet:', err);
            res.status(400).send({ message: 'error in showing table Posts_Diet' });
            return;
        }
        console.log('showing table Posts_Diet');
        res.send(result);
    });
};

const ShowTable_Pickups = (req, res) => {
    const query = 'SELECT * FROM Pickups';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Pickups:', err);
            res.status(400).send({ message: 'error in showing table Pickups' });
            return;
        }
        console.log('showing table Pickups');
        res.send(result);
    });
};

const ShowTable_Update_amount_left = (req, res) => {
    const query = 'SELECT * FROM Update_amount_left';
    SQL.query(query, (err, result) => {
        if (err) {
            console.log('error in showing table Update_amount_left:', err);
            res.status(400).send({ message: 'error in showing table Update_amount_left' });
            return;
        }
        console.log('showing table Update_amount_left');
        res.send(result);
    });
};


//DROP TABLES

const DropTable_Cities = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Cities";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Cities dropped");
    })
    next()
}

const DropTable_Hours = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Hours";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Hours dropped");
    })
    next()
}

const DropTable_Diets = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Diets";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Diets dropped");
    })
    next()
}

const DropTable_Koshers = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Koshers";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Koshers dropped");
    })
    next()
}

const DropTable_Users = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Users";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Users dropped");
    })
    next()
}


const DropTable_Posts = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Posts";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Posts dropped");
    })
    next()
}

const DropTable_Posts_Kosher = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Posts_Kosher";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Posts_Kosher dropped");
    })
    next()
}

const DropTable_Users_Diet = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Users_Diet";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Users_Diet dropped");
    })
    next()
}

const DropTable_Posts_Diet = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Posts_Diet";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Posts_Diet dropped");
    })
    next()
}

const DropTable_Pickups = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Pickups";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Pickups dropped");
    })
    next()
}

const DropTable_Update_amount_left = (req, res, next) => {
    var Q4 = "DROP TABLE IF EXISTS Update_amount_left";
    SQL.query(Q4, (err, mySQLres) => {
        if (err) {
            console.log("error in droping table ", err);
            res.status(400).send({ message: "error om dropping table" + err });
            return;
        }
        console.log("table Update_amount_left dropped");
    })
    next()
}





const ShowTable = (req,res,next)=>{
    var Q3 = "SELECT * FROM Hours";
    SQL.query(Q3, (err, mySQLres1)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        Q3 = "SELECT * FROM Diets";
        SQL.query(Q3, (err, mySQLres2)=>{
            if (err) {
                console.log("error in showing table ", err);
                res.send("error in showing table ");
                return;
            }
            Q3 = "SELECT * FROM Koshers";
            SQL.query(Q3, (err, mySQLres3)=>{
                if (err) {
                    console.log("error in showing table ", err);
                    res.send("error in showing table ");
                    return;
                }
                Q3 = "SELECT * FROM Users";
                SQL.query(Q3, (err, mySQLres4)=>{
                    if (err) {
                        console.log("error in showing table ", err);
                        res.send("error in showing table ");
                        return;
                    }
                    Q3 = "SELECT * FROM Posts";
                    SQL.query(Q3, (err, mySQLres5)=>{
                        if (err) {
                            console.log("error in showing table ", err);
                            res.send("error in showing table ");
                            return;
                        }
                        Q3 = "SELECT * FROM Posts_Kosher";
                        SQL.query(Q3, (err, mySQLres6)=>{
                            if (err) {
                                console.log("error in showing table ", err);
                                res.send("error in showing table ");
                                return;
                            }
                            Q3 = "SELECT * FROM Users_Diet";
                            SQL.query(Q3, (err, mySQLres7)=>{
                                if (err) {
                                    console.log("error in showing table ", err);
                                    res.send("error in showing table ");
                                    return;
                                }
                                Q3 = "SELECT * FROM Posts_Diet";
                                SQL.query(Q3, (err, mySQLres8)=>{
                                    if (err) {
                                        console.log("error in showing table ", err);
                                        res.send("error in showing table ");
                                        return;
                                    }
                                    Q3 = "SELECT * FROM Posts_Diet";
                                    SQL.query(Q3, (err, mySQLres9)=>{
                                        if (err) {
                                            console.log("error in showing table ", err);
                                            res.send("error in showing table ");
                                            return;
                                        }
                                        Q3 = "SELECT * FROM Posts_Diet";
                                        SQL.query(Q3, (err, mySQLres10)=>{
                                            if (err) {
                                                console.log("error in showing table ", err);
                                                res.send("error in showing table ");
                                                return;
                                            }
                                        console.log("showing tables");
                                        res.send({mySQLres1,mySQLres2,mySQLres3,mySQLres4,mySQLres5,mySQLres6,mySQLres7,mySQLres8,mySQLres9,mySQLres10});
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
})};








module.exports = {
    CreateTable_Cities,
    CreateTable_Hours,
    CreateTable_Diets,
    CreateTable_Kosher,
    CreateTable_Users,
    CreateTable_Posts,
    CreateTable_Posts_Kosher,
    CreateTable_Users_Diet,
    CreateTable_Posts_Diet,
    CreateTable_Pickups,
    CreateTable_Update_amount_left,
    InsertData_Cities,
    InsertData_Hours,
    InsertData_Diets,
    InsertData_Koshers,
    InsertData_Users,
    InsertData_Posts,
    InsertData_Posts_Kosher,
    InsertData_Users_Diet,
    InsertData_Posts_Diet,
    InsertData_Pickups,
    InsertData_Update_amount_left,
    DropTable_Cities,
    DropTable_Hours,
    DropTable_Diets,
    DropTable_Koshers,
    DropTable_Users,
    DropTable_Posts,
    DropTable_Posts_Kosher,
    DropTable_Users_Diet,
    DropTable_Posts_Diet,
    DropTable_Pickups,
    DropTable_Update_amount_left,
    ShowTable_Cities,
    ShowTable_Hours,
    ShowTable_Diets,
    ShowTable_Koshers,
    ShowTable_Users,
    ShowTable_Posts,
    ShowTable_Posts_Kosher,
    ShowTable_Users_Diet,
    ShowTable_Posts_Diet,
    ShowTable_Pickups,
    ShowTable_Update_amount_left
};


//???? remeber from naama lecture ?????
//(req, res) => { }