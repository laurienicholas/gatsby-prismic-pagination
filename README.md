# gatsby-prismic-pagination

A little help to get your gatsby-source-prismic-graphql based project paginating.

## Pre-requisites
* This plugin assumes you are using `gatsby-source-prismic-graphql` as your Gatsby source

## Example usage
### Create the paginated index pages:

In `gatsby-node.js`:

```node
const { prismicPagination } = require('gatsby-prismic-pagination');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  await prismicPagination({
    graphql,
    createPage,
    component: path.resolve(`./src/components/PrismicIndex.tsx`), // Just like for createPage
    pathPrefix: '/blog', // Generated e.g. /blog then /blog/2 etc.
    postsPerPage: 15,
    prismicConnectionName: 'allBlog_posts',
    prismicConnectionArgs: {
      sortBy: 'date_DESC',
    },
    nodeFields: ['title'], // You might want to use from destructured return later...
  });
};
```

### Get all posts at once

The plugin will keep querying prismic until it has all your posts. This saves you writing your own loop for prismic's 20 post limit per query:

```node
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const { allPosts } = await prismicPagination(...yourArgsLikeBefore);

  allPosts.forEach((x) => {
    let titleText = x.node.title[0].text;
    const path = yourFnToCreatePath(titleText);
    createPage({
      path,
      component: path.resolve(`./src/components/SinglePrismicBlogPost.tsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: path,
        id: x.node._meta.id,
      },
    });
  });
};
```

## Other pagination options
If you don't want to generate paginated indeces up-front, the source plugin has an example of dynamic pagination: https://github.com/birkir/gatsby-source-prismic-graphql/tree/master/examples/pagination

## Contributing
The plugin is written in typescipt and has rudimentary snapshot based coverage. Please see the `package.json` for available scripts to build and test locally.

## Todos
* Update tests to parse the graphql query in a structured manner rather than a string snapshot