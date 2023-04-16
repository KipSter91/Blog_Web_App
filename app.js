const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const homeStartingContent = "Welcome to my blog website! This platform is designed to provide a space for you to share your thoughts and ideas through blog posts. Whether you're an experienced writer or just getting started, this website is the perfect place to express yourself and engage in meaningful conversations with others. With easy-to-use features and a clean, user-friendly interface, you'll have everything you need to get started right away. So why wait? Start sharing your stories with the world!";
const aboutContent = "I am a full-stack web developer with a strong interest in machine learning and artificial intelligence, specializing in Python's TensorFlow library. After completing my IT studies in Hungary, I began my career as a saw machine operator at AMPCO Metal, where I progressed to the positions of team leader in 2018 and foreman in 2022. While I have excelled in the manufacturing industry, my passion for IT has remained a constant. To keep up with industry developments, I have recently undertaken extensive studies in web development and programming languages, and I am eager to explore new opportunities in this exciting field.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/BlogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postsSchema);

app.get("/", (req, res) => {

  Post.find({})
    .then(posts => {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postId", (req, res) => {

  const requestedPostId = req.params.postId;

  console.log(requestedPostId);

  Post.findOne({ _id: requestedPostId })
    .then(post => {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/compose", (req, res) => {

  upperCaseFirstCharTitle = (title) => {
    return title.charAt(0).toUpperCase() + title.slice(1)
  };
  const post = new Post({
    title: upperCaseFirstCharTitle(req.body.postTitle),
    content: req.body.postBody
  });
  post.save()
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
