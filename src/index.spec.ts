import { prismicPagination } from '.'

describe('Gatsby prismic pagination', () => {
  let graphql: any
  let createPage: jest.MockedFunction<() => void>
  let postsPerPage
  let pathPrefix
  let component
  let prismicConnectionName
  let nodeFields
  let prismicConnectionArgs

  beforeEach(async () => {
    graphql = jest.fn(() => {
      return {
        data: {
          prismic: {
            allBlog_posts: {
              edges: [
                {
                  node: {
                    title: [
                      { type: 'heading1', text: 'Some title', spans: [] },
                    ],
                    _meta: { id: 'asdasdasd234' },
                  },
                },
                {
                  node: {
                    title: [
                      {
                        type: 'heading1',
                        text: 'Anuva one',
                        spans: [],
                      },
                    ],
                    _meta: { id: '98798asd' },
                  },
                },
              ],
              pageInfo: {
                hasNextPage:
                  (graphql as jest.MockedFunction<() => void>).mock.calls
                    .length < 2,
                startCursor: '8fj4sppgkhn;',
                endCursor: '66;][88***9-0854e',
                hasPreviousPage: false,
              },
            },
          },
        },
      }
    }) as any
    createPage = jest.fn() as any
    postsPerPage = 14
    pathPrefix = '/jibble-da-flibble'
    component = 'wibble-da-quibble'
    prismicConnectionName = 'allBig_kahoonas'
    nodeFields = ['beep', 'boop', 'sloop']
    prismicConnectionArgs = {
      sortBy: 'someField_DESC',
      id: 'wrizzle-ma-sizzle',
    }

    await prismicPagination({
      graphql,
      createPage,
      postsPerPage,
      pathPrefix,
      component,
      prismicConnectionName,
      nodeFields,
      prismicConnectionArgs,
    })
  })

  it('should call the supplied graphql function with the appropriate query', () => {
    const mockFn = graphql as jest.MockedFunction<() => void>
    expect(mockFn.mock.calls[0]).toMatchSnapshot()
  })

  it('should call the supplied createPage function with the appropriate args', () => {
    const mockFn = createPage as jest.MockedFunction<() => void>
    expect(mockFn.mock.calls[0]).toMatchSnapshot()
  })
})
