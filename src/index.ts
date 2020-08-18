export const prismicPagination = async (args: {
  prismicConnectionName: string
  postsPerPage: number
  prismicConnectionArgs?: {
    [key: string]: string | string[] | number[] | number
  }
  nodeFields?: string[]
  nodeMeta?: string[]
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
        connectionArgs =
          connectionArgs +
          `${key}: ${Array.isArray(value) ? JSON.stringify(value) : value}, `
      }
    }

    const query = `
      query {
        prismic {
          ${args.prismicConnectionName}(first: ${args.postsPerPage}${
      after ? ', after: "' + after + '"' : ''
    }
      ${args.prismicConnectionArgs ? `, ${connectionArgs}` : ''}) {
            edges {
              node {
                ${
                  args.nodeFields
                    ? args.nodeFields.map(
                        x => `${x}
                `
                      )
                    : ''
                }
                _meta {
                  id
                  ${
                    args.nodeMeta
                      ? args.nodeMeta.map(
                          x => `${x}
                  `
                        )
                      : ''
                  }
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
        mostRecentResults.data.prismic[args.prismicConnectionName].pageInfo
          .endCursor
    )

    allPosts.push(
      ...mostRecentResults.data.prismic[args.prismicConnectionName].edges
    )
    allPages.push(mostRecentResults.data.prismic[args.prismicConnectionName])
    shouldGetNextPage =
      mostRecentResults.data.prismic[args.prismicConnectionName].pageInfo
        .hasNextPage
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
            i > 1 ? `${args.pathPrefix}/${i}` : `${args.pathPrefix}`,
        }),
        currentPageNumber: i + 1,
        ...args.prismicConnectionArgs,
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
