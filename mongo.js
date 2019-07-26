const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const mongoUrl =
  `mongodb+srv://fullstack:${password}@clusterjuissi-xw0pk.mongodb.net/blogilistaus?retryWrites=true&w=majority`

mongoose.connect(mongoUrl, { useNewUrlParser: true })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'kakka',
  author: 'housu',
  url: 'http://kakka.housu.com',
  likes: '2'
})

blog.save().then(response => {
  console.log('blog saved!')
  mongoose.connection.close()
})