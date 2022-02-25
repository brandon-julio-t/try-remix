import {
  __toESM,
  init_react,
  require_react,
  useLoaderData
} from "/build/_shared/chunk-73WN3NLP.js";

// browser-route-module:E:\repos\remix-gql-placeholder\app\routes\posts.tsx?browser
init_react();

// app/routes/posts.tsx
init_react();
var import_react = __toESM(require_react());
var Posts = () => {
  const posts = useLoaderData();
  console.log(posts);
  return /* @__PURE__ */ import_react.default.createElement("div", null, "Posts");
};
var posts_default = Posts;
export {
  posts_default as default
};
//# sourceMappingURL=/build/routes/posts-YJFDJ5GO.js.map
