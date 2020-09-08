import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '/build')));

app.use(bodyParser.json());


/* Set up database operations to be used throughout */
/* 
This process is asynchronous, meaning it will wait for a response before proceeding.
To implement this 'async' is used before setting the function.
Two arguments are passed in, the operations and the response.
*/
const withDB = async (operations, res) => {
  /* Start a try/catch block to exit gracefully if the database has any connectivity issues */
  try {
    /*
    Initialise database.
    Set the database connection as 'client' and use 'await' because the process is asynchronous.
    The mongodb address is default at 27017 and default properties are set for useNewUrlParser.
    */
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
    /* Set the database as 'db' and connect to the specific database 'my-blog' in this case. */
    const db = client.db('my-blog');
    // This function awaits some operations to be performed and passes these in as objects
    await operations(db, res);
    /* Close the database connection after completing operations */
    client.close();
  } catch (error) {
    /* Return an error message if any issues are envcountered with the database connection */
    res.status(500).json({ message: 'Error connecting to db', error });
  }
}

/* Router to get general article info by 'name' */
/*
URL is set for the GET using  the URL parameter ':name'.
This syntax means ':name' will be the text that is entered by the user at this point of the URL.
*/
app.get('/api/articles/:name', async (req, res) => {
  /*
  The WithDB function is called here to perform all the DB operations.
  The async has to be used when this function is used.
  The 'db' specifies the database connection and database we are using.
  */
  withDB(async (db) => {
    /* Set articleName as the request with the URL parameter 'name' */
    const articleName = req.params.name;
    /* 
    Sets articleInfo using mongoDB syntax. Looks in the database collection 
    we made called 'articles' for one result which has the name of the article 
    posted as the URL parameter.
     */
    const articleInfo = await db.collection('articles').findOne({ name: articleName });
    /* Return a result of 200 with a JSON body containing the article info */
    res.status(200).json(articleInfo);
    /*
    The response has to be passed back to the main function as an argument
    in all circumstances if we wish to output any error info.
    */
  }, res);

})

/* 
A router to POST some info to the database taking the article name parameter
and ending with 'upvote' to perform the action of adding a vote for each post.
 */
app.post('/api/articles/:name/upvote', async (req, res) => {
/* Use the withDB function to handle the database operations */
  withDB(async (db) => {
    /*
    Set articleName.
    Set articleInfo.
    */
    const articleName = req.params.name;
    const articleInfo = await db.collection('articles').findOne({ name: articleName });
    /*
    Make an update to articles by passign two arguments:
    - Update 'name' with the name passed in as the URL parameter
    - Use the $set mongoDB syntax to add a value to 'upvotes'. 
      In this case it is incremented by one each time.
    */
    await db.collection('articles').updateOne({ name: articleName }, {
      '$set': {
        upvotes: articleInfo.upvotes + 1,
      },
    });
    /*
    Return the updated version of the article info that was just modified as the result.
    */
    const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
    res.status(200).json(updatedArticleInfo);
  }, res)

});


/* Same as previous POST */
app.post('/api/articles/:name/add-comment', (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;

  withDB(async (db) => {
    const articleInfo = await db.collection('articles').findOne({ name: articleName });
    await db.collection('articles').updateOne({ name: articleName }, {
      '$set': {
        comments: articleInfo.comments.concat({ username, text }),
      },
    });
    const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
    res.status(200).json(updatedArticleInfo);
  }, res);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.listen(8000, () => console.log('Listening on port 8000'));