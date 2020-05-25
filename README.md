# gatsby-prismic-pagination

A little help to get your prismic.io based Gatsby project paginating.

## Pre-requisites

- This plugin assumes you are using `gatsby-source-prismic-graphql` as your Gatsby source

## Example usage

### Create the paginated index pages:

In `gatsby-node.js`:

```js
const { prismicPagination } = require('gatsby-prismic-pagination')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  await prismicPagination({
    graphql,
    createPage,
    component: path.resolve(`./src/components/PrismicIndex.tsx`), // Just like for createPage
    pathPrefix: '/blog', // Generated as e.g. /blog then /blog/2 etc.
    postsPerPage: 15, // Also the amount per call to server
    prismicConnectionName: 'allBlog_posts',
    prismicConnectionArgs: {
      sortBy: 'date_DESC',
    },
    nodeFields: ['title'], // You might want to use from destructured return later...
  })
}
```

### Get all posts at once

The plugin will keep querying prismic until it has all your posts. This saves you writing your own loop for prismic's 20 post limit per query:

```js
const { allPosts } = await prismicPagination(...yourArgsLikeBefore)

// We we have all posts in a single array rather than in prismic paged responses
// so it's easier to construct individual gatsby pages
allPosts.forEach(x => {
  let titleText = x.node.title[0].text
  const path = yourFnToCreatePath(titleText) // Or maybe you want to use a UID?
  createPage({
    path,
    component: path.resolve(`./src/components/SinglePrismicBlogPost.tsx`),
    context: {
      // Data passed to context is available
      // in page queries as GraphQL variables.
      slug: path,
      id: x.node._meta.id,
    },
  })
})
```

## Template usage with next/previous links

```tsx
const PrismicIndex = ({ data, pageContext }) => {
  return (
    <main>
      {data.prismic.allBlog_posts.edges.map((edge, index) => (
            <div key={index}>
              <Link
                to={yourFnToCreatePath(edge.node.title[0].text)}
              >
                {edge.node.title[0].text}
              </Link>
            </div>
        )
      )}

        <footer>
          {pageContext.nextPagePath && (
            <Link to={pageContext.nextPagePath}>Next</Link>
          )}

          {pageContext.previousPagePath && (
            <Link to={pageContext.previousPagePath}>Previous</Link>
          )}
        </footer>
      </main>
    </Layout>
  );
};
export default PrismicIndex;

export const query = graphql`
  query($first: Int = 2, $after: String) {
    prismic {
      allBlog_posts(
        sortBy: date_DESC,
        first: $first,
        after: $after
        ) {
        edges {
          node {
            title
            excerpt
            featured_image
            author
            date
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;
```

## Other pagination options

If your emphasis is less on speed and SEO and more on publishing an article with instant feedback, then the source plugin has an example of run-time pagination: https://github.com/birkir/gatsby-source-prismic-graphql/tree/master/examples/pagination

## Contributing

The plugin is written in typescipt and has rudimentary snapshot based coverage. Please see the `package.json` for available scripts to build and test locally.

## Todos

- Update tests to parse the graphql query in a structured manner rather than a string snapshot
