const sql = require('./db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const getHours = (callback) => {
  const Q = 'SELECT Hour FROM Hours';
  sql.query(Q, (err, results) => {
    if (err) {
      console.log("err");
      callback(err, null);
      return;
    }
    console.log(results);
    callback(null, results);
  });
};

const postfood = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "content cannot be empty" });
    return;
  }
  console.log(req.body);
  try {

    const userQ = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM Users WHERE UserName = ?";
      sql.query(query, req.cookies.activeUser, (err, userQ) => {
        if (err) reject(err);
        resolve(userQ);
      });
    });


    const cities = await new Promise((resolve, reject) => {
      getCities((err, cities) => {
        if (err) reject(err);
        resolve(cities);
      });
    });
    const dietPreferences = await new Promise((resolve, reject) => {
      getDietPreferences((err, dietPreferences) => {
        if (err) reject(err);
        resolve(dietPreferences);
      });
    });
    const koshers = await new Promise((resolve, reject) => {
      getKoshers((err, koshers) => {
        if (err) reject(err);
        resolve(koshers);
      });
    });
    const hours = await new Promise((resolve, reject) => {
      getHours((err, hours) => {
        if (err) reject(err);
        resolve(hours);
      });
    });

    const invalidFields = getInvalidFields_post(req.body);
    console.log(req.body);
    console.log(invalidFields);

    if (invalidFields.length === 0) {
      // Call createPost function passing the necessary parameters
      await createPost(req, res, userQ, cities, koshers, dietPreferences, hours);
    } else {
      console.log("Invalid input");
      const renderData = {
        v1: "Oops! Invalid input",
        user: userQ[0],
        cities,
        koshers,
        dietPreferences,
        hours,
        invalidFields,
      };
      res.status(400).render('PostYourFood', renderData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Database error' });
  }  
};



const upload = multer({ dest: 'images/' });

const saveImage = (req) => {
  return new Promise((resolve, reject) => {
    if (!req.file) {
      reject(new Error('No image file found'));
      return;
    }

    console.log(req.file);

    const imageName = req.file.originalname;
    const imageURL = `../Static/images/${imageName}`;
    const imagePath = path.join(__dirname, `../Static/images/${imageName}`);
    console.log("imagePath", imagePath);
    fs.rename(req.file.path, imagePath, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(imageURL);
    });
  });
};

const createPost = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({ message: 'Content cannot be empty' });
      return;
    }

    console.log("Let's create a new post!!!");

    const imageUrl = await saveImage(req);
    console.log("imageUrl", imageUrl);
    const post = {
      User_share: req.cookies.activeUser,
      Post_date: new Date(),
      URL_photo: imageUrl,
      Title: req.body.title_newPost,
      PhoneNumber_post: req.body.phone_newPost,
      City: req.body.city_newPost,
      Address: req.body.adrress_newPost,
      Description: req.body.description_newPost,
      Quantity: req.body.quantity_newPost,
      Expiry: req.body.expiry_date_newPost,
      Hours_from: req.body.pickup_hours_from_newPost,
      Hours_to: req.body.pickup_hours_to_newPost,
      Amount_available: req.body.quantity_newPost
    };

    console.log(post);

    // Insert the post into the database
    const insertQuery = 'INSERT INTO Posts SET ?';
    sql.query(insertQuery, post, (error, result) => {
      if (error) {
        console.log('Error:', error);
        res.status(400).send({ message: 'Error adding to database' });
        return;
      }

      console.log('Post added!');
      const insertedPostNum = result.insertId;

      // Process diet preferences
      const selectedDietPreferences = Array.isArray(req.body.dietPreference)
        ? req.body.dietPreference
        : [req.body.dietPreference];

      if (selectedDietPreferences.length > 0) {
        selectedDietPreferences.forEach((diet) => {
          console.log('Selected diet preference:', diet);
          const post_diet = {
            Post_num: insertedPostNum,
            Diet: diet
          };
          const insertDietQuery = 'INSERT INTO Posts_diet SET ?';
          sql.query(insertDietQuery, post_diet, (error) => {
            if (error) {
              console.log('Error:', error);
              res.status(400).send({ message: 'Error adding diet preference to database' });
              return;
            }
            console.log(post_diet);
          });
        });
      }

      // Process kosher preferences
      const selectedKosherPreferences = Array.isArray(req.body.kosher)
        ? req.body.kosher
        : [req.body.kosher];

      if (selectedKosherPreferences.length > 0) {
        selectedKosherPreferences.forEach((kosher) => {
          console.log('Selected kosher preference:', kosher);
          const post_kosher = {
            Post_num: insertedPostNum,
            Kosher: kosher
          };
          const insertKosherQuery = 'INSERT INTO Posts_kosher SET ?';
          sql.query(insertKosherQuery, post_kosher, (error) => {
            if (error) {
              console.log('Error:', error);
              res.status(400).send({ message: 'Error adding kosher preference to database' });
              return;
            }
            console.log(post_kosher);
          });
        });
      }

      // Fetch additional data for rendering
      getPost_koshers(insertedPostNum, (err, koshers) => {
        if (err) {
          console.error('Error fetching post:', err);
          res.render('error', { message: 'Error fetching post' });
          return;
        }
        getPost_diets(insertedPostNum, (err, diets) => {
          if (err) {
            console.error('Error fetching post:', err);
            res.render('error', { message: 'Error fetching post' });
            return;
          }
          console.log(diets, koshers);
          res.render('viewPost', {
            amount: post.Amount_available,
            expiry: post.Expiry,
            hours: post.Hours_from + ' - ' + post.Hours_to,
            address: post.City + ' - ' + post.Address,
            phone: post.PhoneNumber_post,
            description: post.Description,
            title: post.Title,
            picture: post.URL_photo,
            koshers: koshers,
            diets: diets,
            postNum: insertedPostNum
          });
        });
      });
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(400).send({ message: 'Error creating post' });
  }
};

const loginUser = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content cannot be empty" });
      return;
    }

    console.log(req.body);
  
    const Q1 = "SELECT * FROM Users WHERE UserName = ?";
    sql.query(Q1, req.body.userName_login, (err, mysqlres) => {
      if (err) {
        res.status(500).send({ message: 'Database error' });
        return;
      }
  
      if (mysqlres.length > 0) {
        const Q2 = "SELECT * FROM users WHERE UserName = ? AND Password = ?";
        sql.query(Q2, [req.body.userName_login, req.body.password_login], (err, mysqlres2) => {
          if (err) {
            res.status(500).send({ message: 'Database error' });
            return;
          }
  
          if (mysqlres2.length > 0) {
            res.cookie("activeUser", req.body.userName_login);
            res.render('HomePage_User', {});
          } else {
            console.log("Error:", err);
            res.status(400).render('log-in', {
              v1: "Incorrect password"
            });
            return;
          }
        });
      } else {
        console.log("Error:", err);
        res.status(400).render('log-in', {
          v1: "User not found"
        });
        return;
      }
    });
  };

const logoutUser = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content cannot be empty" });
      return;
    }
    res.clearCookie("activeUser");
    res.render('HomePage', {});
}

const getPostById = (postId, callback) => {
  const Q1 = "SELECT * FROM Posts WHERE Post_num = ?";
  sql.query(Q1, postId, (err, result) => {
    if (err) {
      console.error("Error fetching posts:", err);
      callback(err, null);
      return;
    }
    console.log(result);
    callback(null, result);
  });
};
const filterSearch = (city_select, city_loc, kosher, diets, callback) => {
  const currentDateTime = new Date();

  let query = "SELECT DISTINCT p.* FROM Posts p";
  query += " LEFT JOIN Posts_diet pd ON p.Post_num = pd.Post_num";
  query += " WHERE p.Expiry >= ?";
  
  const values = [currentDateTime];
  if (city_select && city_loc) {
    query += " AND (p.City = ? OR p.City = ?)";
    values.push(city_select, city_loc);
  }
  else if (city_select) {
    query += " AND p.City = ?";
    values.push(city_select);
  }
  else if (city_loc) {
    query += " AND p.City = ?";
    values.push(city_loc);
  }
  if (kosher) {
    query += " AND EXISTS (SELECT 1 FROM Posts_kosher pk WHERE p.Post_num = pk.Post_num AND pk.Kosher = ?)";
    values.push(kosher);
  }
  if (diets && diets.length > 0) {
    if (Array.isArray(diets)) {
      // Multiple diets selected
      const placeholders = diets.map(() => "?").join(",");
      query += ` AND pd.Diet IN (${placeholders})`;
      values.push(...diets);
    } else {
      // Single diet selected
      query += " AND pd.Diet = ?";
      values.push(diets);
    }
  }

  sql.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching posts:", err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

const getPost_koshers = (postId, callback) => {
  const Q1 = "SELECT * FROM Posts_kosher WHERE Post_num = ?";
  sql.query(Q1, postId, (err, result) => {
    if (err) {
      console.error("Error fetching posts:", err);
      callback(err, null);
      return;
    }
    console.log(result);
    callback(null, result);
  });
};
const getPost_diets = (postId, callback) => {
  const Q1 = "SELECT * FROM Posts_diet WHERE Post_num = ?";
  sql.query(Q1, postId, (err, result) => {
    if (err) {
      console.error("Error fetching posts:", err);
      callback(err, null);
      return;
    }
    console.log(result);
    callback(null, result);
  });
};

const getPosts = (callback) => {
  const query = "SELECT * FROM Posts WHERE Expiry > NOW() AND Amount_available > 0";
  sql.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching posts:", err);
      callback(err, null);
      return;
    }

    callback(null, result);
  });
};

const getCities = (callback) => {
    const query = "SELECT City FROM Cities";
    sql.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching cities:", err);
        callback(err, null);
        return;
      }
      callback(null, result);
    });
};

const getDietPreferences = (callback) => {
    const Q = 'SELECT Diet FROM Diets';
    sql.query(Q, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
};
const getKoshers = (callback) => {
    const Q = 'SELECT Kosher FROM Koshers';
    sql.query(Q, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
};

const signup = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  }

  try {
    const cities = await new Promise((resolve, reject) => {
      getCities((err, cities) => {
        if (err) reject(err);
        resolve(cities);
      });
    });   

    const dietPreferences = await new Promise((resolve, reject) => {
      getDietPreferences((err, dietPreferences) => {
        if (err) reject(err);
        resolve(dietPreferences);
      });
    });

    const Q1 = "SELECT * FROM Users WHERE UserName = ?";
    sql.query(Q1, req.body.UserName_signup, (err, mysqlres) => {
      if (err) {
        res.status(500).send({ message: 'Database error' });
        return;
      }
      if (mysqlres.length === 0) {
        // Validation check
        const invalidFields = getInvalidFields(req.body);
        if (invalidFields.length === 0) {
          // Add to database
          create_user(req, res, cities, dietPreferences, invalidFields);
        } else {
          console.log("Invalid input");
          const renderData = {
            v1: "Oops! Invalid input",
            cities,
            dietPreferences,
            invalidFields
          };
          res.status(400).render('SignUp', renderData);
        }   
      } 
      else {
        const invalidFields = getInvalidFields(req.body);
        console.log("User name already exists");
        const renderData = {
          v1: "User name already exists",
          cities,
          dietPreferences,
          invalidFields
        };
        res.status(400).render('SignUp', renderData);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Database error' });
  }
};



function checkValidUserName(userName) {
  
  if (userName === ""){
    return false;
  }    
  else{
    const Q1 = "SELECT * FROM Users WHERE UserName = ?";
    sql.query(Q1, userName, (err, mysqlres) => {
      if (err) {
        res.status(500).send({ message: 'Database error' });
        return;
      }
      if (mysqlres.length === 0) {
        return true;
      } else {
        console.log("helooooo");
        return false;
      }
    });
  }
  return true;
  
}

function checkValidAddress(address) {
  return address !== "";
}
function checkValidTitle(title) {
  const numericPattern = /^\d+$/;
  return title !== "" && !numericPattern.test(title);
}
function checkValidDescription(description) {
  const numericPattern = /^\d+$/;
  return description !== ""  && !numericPattern.test(description);
}
function checkValidDiet(diets) {
  if(!diets)
    return false;
  return true;
}
function checkValidKosher(koshers) {
  if(!koshers)
    return false;
  return true;
}

function checkValidExpiry(expiryDate) {
  const currentDate = new Date();
  const expiry = new Date(expiryDate);
  return expiryDate !== "" && expiry > currentDate;
}

function checkValidPhoto(photo) {
  return photo !== "";
}
function checkValidCity(City) {
  return City !== "";
}

function checkValidPhoneNumber(phoneNumber) {
  const regex = /^05\d{8}$/;
  return regex.test(phoneNumber);
}

function checkValidPassword(password) {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;
  return regex.test(password);
}

function getInvalidFields(formData) {
  const invalidFields = [];

  if (!checkValidUserName(formData.UserName_signup)) {
    invalidFields.push('UserName_signup');
  }

  if (!checkValidAddress(formData.Address_signup)) {
    invalidFields.push('Address_signup');
  }

  if (!checkValidPhoneNumber(formData.PhoneNumber_signup)) {
    invalidFields.push('PhoneNumber_signup');
  }

  if (!checkValidPassword(formData.Password_signup)) {
    invalidFields.push('Password_signup');
  }

  if (!checkValidCity(formData.city_signup)) {
    invalidFields.push('City_signup');
  }

  return invalidFields;
}

function getInvalidFields_post(formData) {
  const invalidFields = [];

  if (!checkValidTitle(formData.title_newPost)) {
    invalidFields.push('title_newPost');
  }
  if (!checkValidDescription(formData.description_newPost)) {
    invalidFields.push('description_newPost');
  }
  
  if (!checkValidDiet(formData.dietPreference)) {
    invalidFields.push('dietPreference');
  }
  if (!checkValidKosher(formData.kosher)) {
    invalidFields.push('kosher');
  }

  if (!checkValidAddress(formData.adrress_newPost)) {
    invalidFields.push('adrress_newPost');
  }

  if (!checkValidPhoneNumber(formData.phone_newPost)) {
    invalidFields.push('phone_newPost');
  }

  if (!checkValidCity(formData.city_newPost)) {
    invalidFields.push('city_newPost');
  }
  if (!checkValidExpiry(formData.expiry_date_newPost)) {
    invalidFields.push('expiry_date_newPost');
  }
  if (!checkValidPhoto(formData.picture_newPost)) {
    invalidFields.push('picture_newPost');
  }

  return invalidFields;
}


function getInvalidFields_edit(formData) {
  const invalidFields = [];


  if (!checkValidAddress(formData.Address_edit)) {
    invalidFields.push('Address_edit');
  }

  if (!checkValidPhoneNumber(formData.PhoneNumber_edit)) {
    invalidFields.push('PhoneNumber_edit');
  }

  if (!checkValidCity(formData.city_edit)) {
    invalidFields.push('city_edit');
  }

  if (!checkValidPassword(formData.Password_edit)) {
    invalidFields.push('Password_edit');
  }

  return invalidFields;
}




const create_user = (req, res, cities, dietPreferences, invalidFields) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  }

  var isOwner = 0;
  if (req.body.restaurant_signup === "on") {
    isOwner = 1;
  }

  const newUser = {
    UserName: req.body.UserName_signup,
    Password: req.body.Password_signup,
    PhoneNumber_user: req.body.PhoneNumber_signup,
    City: req.body.city_signup,
    Address: req.body.Address_signup,
    RestaurantOwner: isOwner
  };
  
  const Q1 = "INSERT INTO Users SET ?";
  sql.query(Q1, newUser, (err, mysqlres) => {
    if (err) {
      console.log("error:", err);
      const renderData = {
        v1: "error adding to database",
        cities,
        dietPreferences,
        invalidFields,
        userExists: true
      };
      res.render('SignUp', renderData);
      console.log(err)
      return;
    }
    res.cookie("activeUser", req.body.UserName_signup);

    if (!req.body.dietPreference) {
      console.log("No diet preferences selected");
      console.log("added new user! :) ");
      res.redirect('/HomePage_User');
      return;
    }

    const selectedDietPreferences = Array.isArray(req.body.dietPreference)
        ? req.body.dietPreference
        : [req.body.dietPreference];
    selectedDietPreferences.forEach(diet => {
      console.log("Selected diet preference:", diet);
      var user_diet= {
        UserName: req.body.UserName_signup,
        Diet: diet
      }
      const Q2 = "INSERT INTO Users_Diet SET ?";
      sql.query(Q2, user_diet, (err, mysqlres) => {
        if (err) {
          console.log("error:", err);
          const renderData = {
            v1: "error adding to database",
            cities,
            dietPreferences
          };
          res.status(400).render('SignUp', renderData);
          return;
        }
        console.log(user_diet);
      });
    }); 
     
    console.log("added new user! :) ");
    res.redirect('/HomePage_User');
    return;
  });
};




const yourProfile = (req, res) => {
  
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  }
  const activeUser = req.cookies.activeUser;
  console.log(activeUser);

  const Q1 = "SELECT * FROM Users WHERE UserName = ?";
  sql.query(Q1, activeUser, (err, mysqlres) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Database error" });
      return;
    }

    if (mysqlres.length === 0) {
      res.status(404).send({ message: "User not found1" });
      res.render('HomePage', {});
      return;
    }
    const Q2 = "SELECT COUNT(*) AS count FROM Users AS u JOIN Posts AS p ON u.UserName = p.User_share WHERE u.UserName = ?";
    sql.query(Q2, activeUser, (err, mysqlres2) => {
      if (err) {
          console.error(err);
          res.status(500).send({ message: "Database error2" });
          return;
      }
  
      if (mysqlres2.length === 0) {
          res.status(404).send({ message: "User not found2" });
          return;
      }
      const Q3 = "SELECT COUNT(*) AS count FROM Users AS u JOIN Pickups AS p ON u.UserName = p.User_take  WHERE u.UserName = ?";
      sql.query(Q3, activeUser, (err, mysqlres3) => {
          if (err) {
              console.error(err);
              res.status(500).send({ message: "Database error3" });
              return;
          }
      
          if (mysqlres3.length === 0) {
              res.status(404).send({ message: "User not found3" });
              return;
          }

          const Q4 = "SELECT SUM(pic.Amount_taken) AS count FROM Users AS u JOIN Posts AS p ON u.UserName = p.User_share JOIN Pickups AS pic ON p.Post_num=pic.Post_num WHERE u.UserName = ?";
          sql.query(Q4, activeUser, (err, mysqlres4) => {
              if (err) {
                  console.error(err);
                  res.status(500).send({ message: "Database error4" });
                  return;
              }
          
              if (mysqlres4.length === 0) {
                  res.status(404).send({ message: "User not found4" });
                  return;
              }
              const Q5 = "SELECT d.Diet FROM Users AS u JOIN Users_diet AS d ON u.UserName = d.UserName WHERE u.UserName = ?";
              let diets;
              sql.query(Q5, activeUser, (err, mysqlres5) => {
                  if (err) {
                      console.error(err);
                      res.status(500).send({ message: "Database error5" });
                      return;
                  }
              
                  if (mysqlres5.length === 0) {
                      diets=[];
                  }
                  diets=mysqlres5;

                  console.log(mysqlres5);
                  const user= mysqlres[0];
                  res.render("YourProfile", {
                      UserName: user.UserName,
                      City: user.City,
                      Posts_num: mysqlres2[0].count,
                      Pickups_num: mysqlres3[0].count,
                      People: mysqlres4[0].count,
                      dietPreferences: mysqlres5
                  });
              });
          });

        });
    });
});
};

const select_pickup = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  }
  const postId= req.body.postNum;
  const Q2 = "SELECT * FROM Posts WHERE Post_num = ?";
  sql.query(Q2, postId, (err, mysqlres2) => {
    if (err) {
      console.log("error:", err);
      return;
    }
    const post = mysqlres2[0];
    console.log(post.User_share);
    getPost_koshers(postId, (err, koshers) => {
      if (err) {
        console.error("Error fetching post:", err);
        res.render('error', { message: 'Error fetching post' });
        return;
      }
      getPost_diets(postId, (err, diets) => {
        if (err) {
          console.error("Error fetching post:", err);
          res.render('error', { message: 'Error fetching post' });
          return;
        }
        if(req.cookies.activeUser===post.User_share){
              res.render('viewPost', {
                v1: "You can't pickup from your own post",
                amount: post.Amount_available,
                expiry: post.Expiry,
                hours: post.Hours_from + ' - ' + post.Hours_to,
                address: post.City + " , " + post.Address,
                phone: post.PhoneNumber_post,
                description: post.Description,
                title: post.Title,
                picture: post.URL_photo,
                koshers: koshers,
                diets: diets,
                postNum: post.Post_num
              });      
          }else{
          if( post.Amount_available < req.body.amountTaken){
            res.render('viewPost', {
              v1: "You can't pickup more meals then available",
              amount: post.Amount_available,
              expiry: post.Expiry,
              hours: post.Hours_from + ' - ' + post.Hours_to,
              address: post.City + " , " + post.Address,
              phone: post.PhoneNumber_post,
              description: post.Description,
              title: post.Title,
              picture: post.URL_photo,
              koshers: koshers,
              diets: diets,
              postNum: post.Post_num
            });      
          }
          else{
            const pickup = {
              Post_num: req.body.postNum,
              Amount_taken: req.body.amountTaken,
              User_take: req.cookies.activeUser,
              Pickup_dateTime: new Date()
            };
            
            console.log(req.body);
            
            const Q1 = "INSERT INTO Pickups SET ?";
            sql.query(Q1, pickup, (err, mysqlres) => {
              if (err) {
                console.log("error:", err);
                return;
              }
              
              const currntAmount = req.body.amount - req.body.amountTaken;
              
              const Q2 = "UPDATE Posts SET Amount_available = ? WHERE Post_num = ?";
              sql.query(Q2, [currntAmount, req.body.postNum], (err, mysqlres2) => {
                if (err) {
                  console.log("error:", err);
                  return;
                }
                console.log("pickup added & amount updated!");
                console.log(pickup);
                res.render('ApprovedPickup');
              });
            });
          }
        }
      });
    });
  });
};


 
const update_amount = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  }
  const postId = req.body.postNum;
  const Q1 = "UPDATE Posts SET Amount_available = ? WHERE Post_num = ?";
  sql.query(Q1, [req.body.amount, postId], (err, mysqlres) => {
    if (err) {
      console.log("error:", err);
      return;
    }
    getPost_koshers(postId, (err, koshers) => {
      if (err) {
        console.error("Error fetching post:", err);
        res.render('error', { message: 'Error fetching post' });
        return;
      }
      getPost_diets(postId, (err, diets) => {
        if (err) {
          console.error("Error fetching post:", err);
          res.render('error', { message: 'Error fetching post' });
          return;
        }
        const update= {
          Post_num: postId,
          User_update: req.cookies.activeUser, 
          Update_dateTime: new Date(),
          Amount_update: req.body.amount
        }
        const Q3 = "INSERT INTO Update_Amount_left SET ?";
        sql.query(Q3, update , (err, mysqlres) => {
          if (err) {
            console.log("error:", err);
            return;
          }
          const Q2 = "SELECT * FROM Posts WHERE Post_num = ?";
          sql.query(Q2, postId, (err, mysqlres2) => {
            if (err) {
              console.log("error:", err);
              return;
            }
            console.log("amount updated!");
            console.log(mysqlres2);
            const post = mysqlres2[0];
            res.render('viewPost', {
              amount: post.Amount_available,
              expiry: post.Expiry,
              hours: post.Hours_from + ' - ' + post.Hours_to,
              address: post.City + " , " + post.Address,
              phone: post.PhoneNumber_post,
              description: post.Description,
              title: post.Title,
              picture: post.URL_photo,
              koshers: koshers,
              diets: diets,
              postNum: post.Post_num
            });
          });
        });
      });
    });
  });
}

const update_amount_post = (req, res) => {
  const Q1 = "SELECT * FROM Posts WHERE Post_num=?";
  console.log(req.body.postNum);
  sql.query(Q1, req.body.postNum, (err, mysqlres) => {
    if (err) {
      console.log("error:", err);
      return;
    }
    console.log(mysqlres);
    res.render('UpdateAmount', {
      postNum: mysqlres[0].Post_num,
      address: mysqlres[0].City + " , "+ mysqlres[0].Address,
      title: mysqlres[0].Title,
      picture: mysqlres[0].URL_photo,
      amount: mysqlres[0].Amount_available
    });
  });
}

const getUserPickups = (userId, callback) => {
  const query = `
    SELECT
      p.Post_num AS postNum,
      p.URL_photo AS photo,
      p.Title AS title,
      po.User_share AS user,
      DATE_FORMAT(pu.Pickup_dateTime, "%d-%m-%Y") AS pickupDate
    FROM
      Pickups AS pu
      INNER JOIN Posts AS p ON pu.Post_num = p.Post_num
      INNER JOIN Posts AS po ON p.Post_num = po.Post_num
    WHERE
      pu.User_take = ?
  `;
  sql.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user pickups:", err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};
const getUser = (userId, callback) => {
  const query = 'SELECT * FROM Users WHERE userName = ?';
  sql.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user:", err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

const getSharedPosts = (userId, callback) => {
  const query = `
    SELECT
      p.Post_num AS postNum,
      p.URL_photo AS photo,
      p.Title AS title,
      DATE_FORMAT(p.Post_date, "%d-%m-%Y") AS postDate,
      COUNT(pu.User_take) AS pickupCount
    FROM
      Posts AS p
      LEFT JOIN Pickups AS pu ON p.Post_num = pu.Post_num
    WHERE
      p.User_share = ?
    GROUP BY
      p.Post_num
  `;
  sql.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching shared posts:", err);
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};
  

const update_user = (req, res, user, cities, allDiet, myDiet, invalidFields) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  }

  var isOwner = 0;
  if (req.body.restaurant_edit === "on") {
    isOwner = 1;
  }

  const updateUser = {
    UserName: req.cookies.activeUser,
    Password: req.body.Password_edit,
    PhoneNumber_user: req.body.PhoneNumber_edit,
    City: req.body.city_edit,
    Address: req.body.Address_edit,
    RestaurantOwner: isOwner
  };

  console.log(updateUser);
  
  const Q1 = "UPDATE Users SET ? WHERE UserName = ?";
  sql.query(Q1, [updateUser, req.cookies.activeUser], (err, mysqlres) => {
    if (err) {
      console.log("error:", err);
      const renderData = {
        v1: "Oops! Invalid input",
        user,
        cities,
        allDiet,
        myDiet,
        invalidFields
      };
      res.status(400).render('EditProfile', renderData);
      return;
    }
    const Q0 = "DELETE From Users_Diet WHERE userName= ?";
    sql.query(Q0, req.cookies.activeUser, (err, mysqlres) => {
      if (err) {
        console.log("error:", err);
        const renderData = {
          v1: "Oops! Invalid input",
          user,
          cities,
          allDiet,
          myDiet,
          invalidFields
        };
        res.status(400).render('EditProfile', renderData);
        return;
      }
   
      const selectedDietPreferences = Array.isArray(req.body.dietPreference)
      ? req.body.dietPreference
      : [req.body.dietPreference];

      selectedDietPreferences.forEach(diet => {
        console.log("Selected diet preference:", diet);
        var user_diet= {
          UserName: req.cookies.activeUser,
          Diet: diet
        }
        const Q2 = "INSERT INTO Users_Diet SET ?";
        sql.query(Q2, user_diet, (err, mysqlres) => {
          if (err) {
            console.log("error:", err);
            const renderData = {
              v1: "Oops! Invalid input",
              user,
              cities,
              allDiet,
              myDiet,
              invalidFields
            };
            res.status(400).render('EditProfile', renderData);
            return;
          }
          console.log(user_diet);
        });
      }); 
      
      console.log("user Updated! :) ");
      res.redirect('/YourProfile');
      return;
    });
  });
};

const editProfile = (req, res) => {
  
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  }
  const activeUser = req.cookies.activeUser;

  const Q1 = "SELECT * FROM Users WHERE UserName = ?";
  sql.query(Q1, activeUser, (err, mysqlres) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Database error" });
      return;
    }
    if (mysqlres.length === 0) {
      res.status(404).send({ message: "User not found" });
      res.render('HomePage', {});
      return;
    }

    const Q2 = "SELECT d.Diet FROM Users AS u JOIN Users_diet AS d ON u.UserName = d.UserName WHERE u.UserName = ?";
    sql.query(Q2, activeUser, (err, mysqlres2) => {
      if (err) {
          console.error(err);
          res.status(500).send({ message: "Database error" });
          return;
      }
  
      if (mysqlres2.length === 0) {
          res.status(404).send({ message: "User_diet not found" });
          return;
      }
      const Q3 = "SELECT Diet FROM Diets";
      sql.query(Q3, (err, mysqlres3) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: "Database error" });
            return;
        }
        const Q4 = "SELECT City FROM cities";
        sql.query(Q4, (err, mysqlres4) => {
          if (err) {
              console.error(err);
              res.status(500).send({ message: "Database error" });
              return;
          }

         
          const user= mysqlres[0];
          console.log(user);
          res.render("EditProfile", {
              user: user,
              allDiet:mysqlres3,
              myDiet: mysqlres2,
              cities: mysqlres4
          });
        });
      });
    });
  });
};

const editProfile_data = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  }
  const activeUser = req.cookies.activeUser;

  const Q1 = "SELECT * FROM Users WHERE UserName = ?";
  sql.query(Q1, activeUser, (err, userQ) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Database error" });
      return;
    }
    if (userQ.length === 0) {
      res.status(404).send({ message: "User not found" });
      res.render('HomePage', {});
      return;
    }
    

    const Q2 = "SELECT d.Diet FROM Users AS u JOIN Users_diet AS d ON u.UserName = d.UserName WHERE u.UserName = ?";
    sql.query(Q2, activeUser, (err, myDiet) => {
      if (err) {
          console.error(err);
          res.status(500).send({ message: "Database error" });
          return;
      }
  
      if (myDiet.length === 0) {
          res.status(404).send({ message: "User_diet not found" });
          return;
      }
      const Q3 = "SELECT Diet FROM Diets";
      sql.query(Q3, (err, allDiet) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: "Database error" });
            return;
        }
        const Q4 = "SELECT City FROM cities";
        sql.query(Q4, (err, cities) => {
          if (err) {
              console.error(err);
              res.status(500).send({ message: "Database error" });
              return;
          }

          console.log(req.body.PhoneNumber_edit);

          const invalidFields = getInvalidFields_edit(req.body);
          console.log(invalidFields);
          if (invalidFields.length === 0) {
          // Add to database
          update_user(req, res, userQ[0], cities, allDiet, myDiet, invalidFields);
          } else {
            console.log("Invalid input");
            const renderData = {
              v1: "Invalid input",
              user: userQ[0],
              cities:cities ,
              allDiet:allDiet,
              myDiet:myDiet,
              invalidFields
            };
            res.status(400).render('EditProfile', renderData);
          }
      }); 
    }); 
  }); 
}); 
};


module.exports = {
  createPost,
  loginUser,
  filterSearch,
  getPosts,
  getUserPickups,
  getSharedPosts,
  getPost_koshers,
  update_amount_post,
  update_amount,
  getPost_diets,
  getCities,
  getDietPreferences,
  getKoshers,
  getHours,
  getPostById,
  signup,
  logoutUser,
  postfood,
  yourProfile,
  select_pickup,
  editProfile,
  editProfile_data,
  getUser,
  upload
};