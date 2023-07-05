const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const CRUD = require('./db/CRUD');
const cookieParser = require('cookie-parser');
const CreateDB_CRUD = require('./db/CreateDB_CRUD');
const port = 3000;

//set up pug
app.set('views',path.join(__dirname,'Views'));
app.set('view engine','pug');

app.use('/Static', express.static('Static'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));


///////set DB -> add all route to create, fill, drop all tables 

  app.get('/CreateTable',[
    CreateDB_CRUD.CreateTable_Cities,
    CreateDB_CRUD.CreateTable_Hours,
    CreateDB_CRUD.CreateTable_Diets,
    CreateDB_CRUD.CreateTable_Kosher,
    CreateDB_CRUD.CreateTable_Users,
    CreateDB_CRUD.CreateTable_Posts,
    CreateDB_CRUD.CreateTable_Pickups,
    CreateDB_CRUD.CreateTable_Update_amount_left,
    CreateDB_CRUD.CreateTable_Posts_Kosher,
    CreateDB_CRUD.CreateTable_Users_Diet,
    CreateDB_CRUD.CreateTable_Posts_Diet]);

app.get('/InsertTable',[
    CreateDB_CRUD.InsertData_Cities,
    CreateDB_CRUD.InsertData_Hours,
    CreateDB_CRUD.InsertData_Diets,
    CreateDB_CRUD.InsertData_Koshers,
    CreateDB_CRUD.InsertData_Users,
    CreateDB_CRUD.InsertData_Posts,
    CreateDB_CRUD.InsertData_Pickups,
    CreateDB_CRUD.InsertData_Update_amount_left,
    CreateDB_CRUD.InsertData_Posts_Kosher,
    CreateDB_CRUD.InsertData_Users_Diet,
    CreateDB_CRUD.InsertData_Posts_Diet
]);

app.get('/DropTable',[CreateDB_CRUD.DropTable_Cities,
    CreateDB_CRUD.DropTable_Hours,
    CreateDB_CRUD.DropTable_Diets,
    CreateDB_CRUD.DropTable_Koshers,
    CreateDB_CRUD.DropTable_Users,
    CreateDB_CRUD.DropTable_Posts,
    CreateDB_CRUD.DropTable_Posts_Kosher,
    CreateDB_CRUD.DropTable_Users_Diet,
    CreateDB_CRUD.DropTable_Posts_Diet,
    CreateDB_CRUD.DropTable_Pickups,
    CreateDB_CRUD.DropTable_Update_amount_left]);




//post queries
app.post('/Login', CRUD.loginUser);
app.post('/Log_out', CRUD.logoutUser);
app.post('/Sign_up', CRUD.signup);
app.get('/YourProfile', CRUD.yourProfile);
app.post('/createPost', CRUD.createPost);
app.post('/Post_food',CRUD.upload.single('picture_newPost'), CRUD.postfood);


app.post('/Edit_profile', CRUD.editProfile_data);

app.get('/EditProfile', CRUD.editProfile);

app.post('/selectPickup', CRUD.select_pickup);

app.get('/HomePage_User', (req, res) => {
    res.render('HomePage_User');
});

app.get('/HomePage', (req, res) => {
    res.render('HomePage');
});

app.get('/', (req,res)=>{
    res.clearCookie('activeUser');
    res.render('HomePage');
});

app.get('/log-in', (req, res) => {
    res.render('log-in');
});

app.get('/Search', async (req, res) => {
  try {
    if (!req.cookies.activeUser) {
      res.render('PleaseLogIn');
      return;
    }
    const posts = await new Promise((resolve, reject) => {
      CRUD.getPosts((err, posts) => {
        if (err) reject(err);
        resolve(posts);
      });
    });

    const cities = await new Promise((resolve, reject) => {
      CRUD.getCities((err, cities) => {
        if (err) reject(err);
        resolve(cities);
      });
    });

    const dietPreferences = await new Promise((resolve, reject) => {
      CRUD.getDietPreferences((err, dietPreferences) => {
        if (err) reject(err);
        resolve(dietPreferences);
      });
    });

    const koshers = await new Promise((resolve, reject) => {
      CRUD.getKoshers((err, koshers) => {
        if (err) reject(err);
        resolve(koshers);
      });
    });

    // Get filter values from query parameters
    const { city_search, city , kosher_search, dietPreference_search } = req.query;
    const filterValues = {
      city_loc: city || '',
      city_select: city_search || '',
      kosher: kosher_search || '',
      dietPreferences: Array.isArray(dietPreference_search) ? dietPreference_search : [dietPreference_search]
    };

    res.render('Search', { posts, cities, dietPreferences, koshers, filterValues });
  } catch (err) {
    res.status(500).send({ message: 'Database error' });
  }
});

app.post('/filterPosts', async (req, res) => {
  try {
    const { city, city_search, kosher_search, dietPreference_search } = req.body;
    const filterValues = {
      city_loc: city,
      city_select: city_search ,
      kosher: kosher_search,
      dietPreferences: Array.isArray(dietPreference_search) ? dietPreference_search : [dietPreference_search].filter(Boolean)
    };
    const posts = await new Promise((resolve, reject) => {
      CRUD.filterSearch(filterValues.city_select, filterValues.city_loc, filterValues.kosher, filterValues.dietPreferences, (err, posts) => {
        if (err) {
          reject(err);
        } else {
          resolve(posts);
        }
      });
    });

    const cities = await new Promise((resolve, reject) => {
      CRUD.getCities((err, cities) => {
        if (err) reject(err);
        resolve(cities);
      });
    });

    const dietPreferences = await new Promise((resolve, reject) => {
      CRUD.getDietPreferences((err, dietPreferences) => {
        if (err) reject(err);
        resolve(dietPreferences);
      });
    });

    const koshers = await new Promise((resolve, reject) => {
      CRUD.getKoshers((err, koshers) => {
        if (err) reject(err);
        resolve(koshers);
      });
    });

    res.render('Search', { posts, cities, dietPreferences, koshers, filterValues });
  } catch (err) {
    res.status(500).send({ message: 'Database error' });
  }
});


app.get('/PostYourFood', async (req, res) => {
  try {
    if (!req.cookies.activeUser) {
      res.render('PleaseLogIn');
      return;
    }
    const cities = await new Promise((resolve, reject) => {
      CRUD.getCities((err, cities) => {
        if (err) reject(err);
        resolve(cities);

      });
    });
    
    const dietPreferences = await new Promise((resolve, reject) => {
      CRUD.getDietPreferences((err, dietPreferences) => {
        if (err) reject(err);
        resolve(dietPreferences);
      });
    });

    const koshers = await new Promise((resolve, reject) => {
      CRUD.getKoshers((err, koshers) => {
        if (err) reject(err);
        resolve(koshers);
      });
    });

    const hours = await new Promise((resolve, reject) => {
      CRUD.getHours((err, hours) => {
        if (err) reject(err);
        resolve(hours);
      });
    });
    const user = await new Promise((resolve, reject) => {
      CRUD.getUser(req.cookies.activeUser, (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
    res.render('PostYourFood', { user:user[0], cities, dietPreferences, koshers, hours });
    
  } catch (err) {
    res.status(500).send({ message: 'Database error' });
  }
});  
app.get('/LogOut', (req, res) => {
    res.clearCookie('activeUser');
    res.render('LogOut');
});



app.post('/update_amount', CRUD.update_amount);

app.post('/UpdateAmountPost', CRUD.update_amount_post);

app.get('/YourPickups', (req, res) => {
  CRUD.getUserPickups(req.cookies.activeUser, (err, pickups) => {
    if (err) {
      console.error("Error fetching post:", err);
      res.render('error', { message: 'Error fetching post' });
      return;
    }
    res.render('YourPickups', {
      user: req.cookies.activeUser,
      pickups: pickups
    });
  });
});

app.get('/FoodYouShared', (req, res) => {
  CRUD.getSharedPosts(req.cookies.activeUser, (err, posts) => {
    if (err) {
      console.error("Error fetching post:", err);
      res.render('error', { message: 'Error fetching post' });
      return;
    }
    res.render('FoodYouShared', {
      user: req.cookies.activeUser,
      posts: posts
    });
  });
});

app.get('/viewPost', (req, res) => {

  const postId = req.query.post;
  CRUD.getPostById(postId, (err, post) => {
    if (err) {
      console.error("Error fetching post:", err);
      res.render('error', { message: 'Error fetching post' });
      return;
    }
    CRUD.getPost_koshers(postId, (err, koshers) => {
      if (err) {
        console.error("Error fetching post:", err);
        res.render('error', { message: 'Error fetching post' });
        return;
      }
      CRUD.getPost_diets(postId, (err, diets) => {
        if (err) {
          console.error("Error fetching post:", err);
          res.render('error', { message: 'Error fetching post' });
          return;
        }

        if (post && post.length > 0) {
          const result = post[0];
          res.render('viewPost', {
            amount: result.Amount_available,
            expiry: result.Expiry,
            hours: result.Hours_from + ' - ' + result.Hours_to,
            address: result.City + " , " + result.Address ,
            phone: result.PhoneNumber_post,
            description: result.Description,
            title: result.Title,
            picture: result.URL_photo,
            koshers: koshers,
            diets: diets, 
            postNum: result.Post_num
          });
      
        } else {
          res.render('error', { message: 'Post not found' });
        }
      });
    });
  });
});

app.get('/SignUp', async (req, res) => {
    try {
      const cities = await new Promise((resolve, reject) => {
        CRUD.getCities((err, cities) => {
          if (err) reject(err);
          resolve(cities);
        });
      });
  
      const dietPreferences = await new Promise((resolve, reject) => {
        CRUD.getDietPreferences((err, dietPreferences) => {
          if (err) reject(err);
          resolve(dietPreferences);
        });
      });

      const koshers = await new Promise((resolve, reject) => {
        CRUD.getKoshers((err, koshers) => {
          if (err) reject(err);
          resolve(koshers);
        });
      });
  
      res.render('SignUp', { cities, dietPreferences, koshers });
    } catch (err) {
      res.status(500).send({ message: 'Database error' });
    }
  });








app.listen(port, () =>{
    console.log("server is running on port ", port);
});




