export const prismicPagination = async (args: {
  prismicConnectionName: string
  postsPerPage: number
  prismicConnectionArgs?: {
    [key: string]: string
  }
  nodeFields?: string[]
  component: string
  graphql: (query: string) => Promise<IGraphQlResponse>
  createPage: (args: {
    path: string
    component: string
    context: {
      [property: string]: any
    }
  }) => void
  pathPrefix: string
}) => {
  const getNextResults = async (after: string | null = null) => {
    let connectionArgs = ''
    if (args.prismicConnectionArgs) {
      for (const [key, value] of Object.entries(args.prismicConnectionArgs)) {
        connectionArgs = connectionArgs + `${key}: ${value}, `
      }
    }

    const query = `
      query {
        prismic {
          ${args.prismicConnectionName}(first: ${args.postsPerPage}, ${
      after ? ', after: "' + after + '"' : ''
    }
      ${args.prismicConnectionArgs ? connectionArgs : ''}) {
            edges {
              node {
                ${
                  args.nodeFields &&
                  args.nodeFields.map(
                    x => `${x}
                `
                  )
                }
                _meta {
                  id
                }
              }
            }
            pageInfo {
              hasNextPage
              startCursor
              endCursor
              hasPreviousPage
            }
          }
        }
      }
    `
    return await args.graphql(query)
  }
  let mostRecentResults: IGraphQlResponse
  let shouldGetNextPage = true
  const allPosts = []
  const allPages = []

  while (shouldGetNextPage) {
    // @ts-ignore
    mostRecentResults = await getNextResults(
      // @ts-ignore
      mostRecentResults &&
        mostRecentResults.data.prismic.allBlog_posts.pageInfo.endCursor
    )

    allPosts.push(...mostRecentResults.data.prismic.allBlog_posts.edges)
    allPages.push(mostRecentResults.data.prismic.allBlog_posts)
    shouldGetNextPage =
      mostRecentResults.data.prismic.allBlog_posts.pageInfo.hasNextPage
  }

  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i]
    const previousPage = i > 0 ? allPages[i - 1] : null
    const path = `${args.pathPrefix}` + (i > 0 ? `/${i + 1}` : '')
    args.createPage({
      path,
      component: args.component,
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: path,
        first: args.postsPerPage,
        ...(previousPage && { after: previousPage.pageInfo.endCursor }),
        ...(page.pageInfo.hasNextPage && {
          nextPagePath: `${args.pathPrefix}/${i + 2}`,
        }),
        ...(i > 0 && {
          previousPagePath:
            i > 1 ? `${args.pathPrefix}/${i}` : '${args.pathPrefix}',
        }),
      },
    })
  }

  return { allPosts, allPages }
}

interface IGraphQlResponse {
  data: {
    prismic: {
      [connectionName: string]: {
        edges: {
          node: {
            [property: string]: any
          }
        }[]
        pageInfo: {
          startCursor: string
          endCursor: string
          hasNextPage: boolean
          hasPreviousPage: boolean
        }
      }
    }
  }
}
