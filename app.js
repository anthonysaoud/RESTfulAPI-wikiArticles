const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const req = require('express/lib/request')
const { redirect } = require('express/lib/response')

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewURLParser: true })

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
}
)

const Article = mongoose.model('article', articleSchema)


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//requests targetting all articles//

app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, results) {
            if (err) {
                res.send(err)
            } else {
                res.send(results)
            }
        })
    })

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article")
            } else {
                res.send(err)
            }
        })
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("You have successfully deleted all the articles")
            } else {
                res.send(err)
            }
        })
    })

//requests targetting specific articles//

app.route("/articles/:articleTitle")
    .get(function (req, res) {


        Article.findOne({ title: req.params.articleTitle }, function (err, result) {
            if (!err) {
                res.send(result)
            } else {
                res.send("No Articles matching that title")
            }
        })
    })

    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { upsert: true },
            function (err) {
                if (!err) {
                    res.send("successfully updated")
                } else {
                    res.send(err)
                }
            })
    })

    .patch(function (req,res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            {$set:req.body},
            { upsert: true },
            function (err) {
                if (!err) {
                    res.send("successfully updated")
                } else {
                    res.send(err)
                }
            })
        })

    .delete(function (req,res) {
        Article.deleteOne({title:req.params.articleTitle},function(err){
            if (!err) {
                res.send("Successfully deleted this article")
            } else {
                redirect.send(err)
            }
        })

    })

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000")
})