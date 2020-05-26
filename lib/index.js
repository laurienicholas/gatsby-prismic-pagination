"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismicPagination = void 0;
exports.prismicPagination = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var getNextResults, mostRecentResults, shouldGetNextPage, allPosts, allPages, i, page, previousPage, path;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getNextResults = function (after) {
                    if (after === void 0) { after = null; }
                    return __awaiter(void 0, void 0, void 0, function () {
                        var connectionArgs, _i, _a, _b, key, value, query;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    connectionArgs = '';
                                    if (args.prismicConnectionArgs) {
                                        for (_i = 0, _a = Object.entries(args.prismicConnectionArgs); _i < _a.length; _i++) {
                                            _b = _a[_i], key = _b[0], value = _b[1];
                                            connectionArgs = connectionArgs + (key + ": " + value + ", ");
                                        }
                                    }
                                    query = "\n      query {\n        prismic {\n          " + args.prismicConnectionName + "(first: " + args.postsPerPage + ", " + (after ? ', after: "' + after + '"' : '') + "\n      " + (args.prismicConnectionArgs ? connectionArgs : '') + ") {\n            edges {\n              node {\n                " + (args.nodeFields &&
                                        args.nodeFields.map(function (x) { return x + "\n                "; })) + "\n                _meta {\n                  id\n                }\n              }\n            }\n            pageInfo {\n              hasNextPage\n              startCursor\n              endCursor\n              hasPreviousPage\n            }\n          }\n        }\n      }\n    ";
                                    return [4 /*yield*/, args.graphql(query)];
                                case 1: return [2 /*return*/, _c.sent()];
                            }
                        });
                    });
                };
                shouldGetNextPage = true;
                allPosts = [];
                allPages = [];
                _a.label = 1;
            case 1:
                if (!shouldGetNextPage) return [3 /*break*/, 3];
                return [4 /*yield*/, getNextResults(
                    // @ts-ignore
                    mostRecentResults &&
                        mostRecentResults.data.prismic.allBlog_posts.pageInfo.endCursor)];
            case 2:
                // @ts-ignore
                mostRecentResults = _a.sent();
                allPosts.push.apply(allPosts, mostRecentResults.data.prismic.allBlog_posts.edges);
                allPages.push(mostRecentResults.data.prismic.allBlog_posts);
                shouldGetNextPage =
                    mostRecentResults.data.prismic.allBlog_posts.pageInfo.hasNextPage;
                return [3 /*break*/, 1];
            case 3:
                for (i = 0; i < allPages.length; i++) {
                    page = allPages[i];
                    previousPage = i > 0 ? allPages[i - 1] : null;
                    path = "" + args.pathPrefix + (i > 0 ? "/" + (i + 1) : '');
                    args.createPage({
                        path: path,
                        component: args.component,
                        context: __assign(__assign(__assign({ 
                            // Data passed to context is available
                            // in page queries as GraphQL variables.
                            slug: path, first: args.postsPerPage }, (previousPage && { after: previousPage.pageInfo.endCursor })), (page.pageInfo.hasNextPage && {
                            nextPagePath: args.pathPrefix + "/" + (i + 2),
                        })), (i > 0 && {
                            previousPagePath: i > 1 ? args.pathPrefix + "/" + i : '${args.pathPrefix}',
                        })),
                    });
                }
                return [2 /*return*/, { allPosts: allPosts, allPages: allPages }];
        }
    });
}); };
