const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Blake on halko',
    author: 'Blake Stone',
    url: 'http://kakka.housu.com',
    likes: 10
  },
  {
    title: 'Joonas on halko',
    author: 'Joonas',
    url: 'http://kakka.housu.com',
    likes: 30
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}