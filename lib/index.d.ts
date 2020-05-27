export declare const prismicPagination: (args: {
    prismicConnectionName: string;
    postsPerPage: number;
    prismicConnectionArgs?: {
        [key: string]: string;
    } | undefined;
    nodeFields?: string[] | undefined;
    nodeMeta?: string[] | undefined;
    component: string;
    graphql: (query: string) => Promise<IGraphQlResponse>;
    createPage: (args: {
        path: string;
        component: string;
        context: {
            [property: string]: any;
        };
    }) => void;
    pathPrefix: string;
}) => Promise<{
    allPosts: {
        node: {
            [property: string]: any;
        };
    }[];
    allPages: {
        edges: {
            node: {
                [property: string]: any;
            };
        }[];
        pageInfo: {
            startCursor: string;
            endCursor: string;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }[];
}>;
interface IGraphQlResponse {
    data: {
        prismic: {
            [connectionName: string]: {
                edges: {
                    node: {
                        [property: string]: any;
                    };
                }[];
                pageInfo: {
                    startCursor: string;
                    endCursor: string;
                    hasNextPage: boolean;
                    hasPreviousPage: boolean;
                };
            };
        };
    };
}
export {};
