const express = require('express');
require('dotenv/config');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.MONGO_DB}:${process.env.MONGO_PASSWORD_CLUSTER}@clusterblog.nhgcy.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBlog`;
const { authorModel, blogModel } = require('./models');
console.log("process.env.MONGO_USER", process.env.MONGO_USER);
console.log("process.env.MONGO_PASSWORD", process.env.MONGO_PASSWORD);
console.log("process.env.MONGO_PASSWORD_CLUSTER", process.env.MONGO_PASSWORD_CLUSTER);
console.log("process.env.MONGO_DB", process.env.MONGO_DB);


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/authors', async (req, res) => {
  try {
    const authors = await authorModel.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "author",
          as: "blogs"
        }
      }
    ]);
    return res.json({ authors });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/authors', async (req, res) => {
  try {
    const name = req.body?.name;
    const age = req.body?.age;

    if (!name || !age) {
      return res.status(400).json({ message: 'Bad request, name or age not found' });
    }
    const author = new authorModel({
      name,
      age
    });

    const save = await author.save();
    return res.status(201).json({ author: save });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/blogs', async (req, res) => {
  try {
    const blogs = await blogModel.find({});
    return res.json({ blogs });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/blogs', async (req, res) => {
  try {
    const id = req.body?.id;
    const title = req.body?.title;
    const description = req.body?.description;
    const author = req.body?.author;

    if (!title || !description || !author || !id) {
      return res.status(400).json({ message: 'Bad request, id or title or description or author not found' });
    }
    const blog = new blogModel({
      id,
      title,
      description,
      author
    });

    const save = await blog.save();
    return res.status(201).json({ blog: save });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connection success');
    app.listen(port, () => {
      console.log(`Server listen on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Connection fail', error);
  });