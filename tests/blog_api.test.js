const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.remove({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(titles).toContain(
    'Blake on halko'
  )
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Rauno on halko',
    author: 'Rauno',
    url: 'http://kakka.housu.com',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'Rauno on halko'
  )
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Joonas',
    url: 'http://nahka.housu.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'nahkahousu',
    author: 'Joonas',
    likes: 51
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultBlog.body).toEqual(blogToView)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.content)
})


test('id is defined within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const ids = response.body.map(r => r.id)

  expect(ids).toBeDefined()
})

test('likes default value is zero', async () => {
  const newBlog = {
    title: 'No likes at all',
    author: 'Kikkeli',
    url: 'http://kakka.housu.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const zeroLikes = response.body.filter(r => r.title === 'No likes at all')
  console.log('zeroLikes', zeroLikes)
  console.log('zeroLikes[0].likes', zeroLikes[0].likes)
  expect(zeroLikes[0].likes).toBe(0)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  blogToUpdate.likes = 333

  const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)

  expect(updatedBlog.body.likes).toBe(333)
})


// Close DB Connection
afterAll(() => {
  mongoose.connection.close()
})