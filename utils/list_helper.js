const _ = require('lodash')


const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce(function(a,b){
    //console.log('a', a)
    //console.log('b', b.likes)
    const summa = a + b.likes
    //console.log('summa', summa)
    return summa
  }, 0)
}

const favoriteBlog = blogs => {
  const blogLikes = blogs.map(i => i.likes)
  //console.log('blogLikes', blogLikes)
  const maxLikes = Math.max(...blogLikes)
  //console.log('maxLikes', maxLikes)
  const mostLikedBlog = blogs.find(i => i.likes === maxLikes)
  //console.log('mostLikedBlog', mostLikedBlog)
  return mostLikedBlog
}

const mostBlogs = blogs => {
  const authorArray = _.map(blogs,'author')
  //console.log('authorArray', authorArray)
  //var mostCommonAuthorName = _.chain(authorArray).countBy().toPairs().max(_.last).head().value()
  //var mostCommonAuthorBlogs = _.chain(authorArray).countBy().toPairs().max(_.last).last().value()
  const mostCommonAuthor = _.chain(authorArray).countBy().toPairs().max(_.last).value()

  //console.log('mostCommonAuthorName', mostCommonAuthorName)
  //console.log('mostCommonAuthorBlogs', mostCommonAuthorBlogs)
  //console.log('mostCommonAuthor', mostCommonAuthor)

  const mostCommonAuthorNew =
    {
      author: mostCommonAuthor[0],
      blogs: mostCommonAuthor[1]
    }


  //console.log('mostCommonAuthor NEW', mostCommonAuthorNew)
  return mostCommonAuthorNew
}

const mostLikes = blogs => {
//   const authorArray = _.map(blogs,'author')
//   const authorLikesArray = _.map(blogs, _.partialRight(_.pick, ['author', 'likes']))
//   console.log('authorLikesArray', authorLikesArray)

  const summedLikes = _(blogs)
    .groupBy('author')
    .map((objs, key) => {
      return {
        'author': key,
        'likes': _.sumBy(objs, 'likes')
      }
    })
    .value()

  //console.log('summedLikes', summedLikes)

  const mostLikedAuthor = _.chain(summedLikes).orderBy('likes', 'desc').head().value()
  //console.log('mostLikedAuthor', mostLikedAuthor)

  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}