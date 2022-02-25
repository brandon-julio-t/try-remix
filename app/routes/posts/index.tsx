import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  useLoaderData,
} from "remix";
import { v4 } from "uuid";
import useSession from "~/hooks/use.session";
import Post from "~/models/post.model";
import User from "~/models/user.model";

export const loader: LoaderFunction = async ({ request }) => {
  return await useSession(session => json(session.get("posts") ?? []), request);
};

export const action: ActionFunction = async ({ request }) => {
  return await useSession(async session => {
    const user = session.get("current-user") as User;
    const posts = (session.get("posts") ?? []) as Post[];
    const data = await request.formData();
    const newPost = new Post(
      v4(),
      data.get("title")?.toString() ?? "",
      data.get("content")?.toString() ?? "",
      new Date(),
      user
    );
    session.set("posts", [...posts, newPost]);
    return json(newPost);
  }, request);
};

const Posts = () => {
  const posts = useLoaderData<Post[]>();
  return (
    <Container>
      <Typography variant="h4">Posts</Typography>
      <Stack spacing={2}>
        {posts.length > 0 ? (
          posts.map(post => (
            <Card key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <CardContent>
                  <Typography variant="h5">{post.title}</Typography>
                  <Typography variant="body1">
                    {post.truncatedContent}
                  </Typography>
                  <Typography variant="body2">
                    {post.createdAt} &mdash; {post.user?.name ?? "Unknown"}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <Box>
            <Typography variant="h5">No posts.</Typography>
          </Box>
        )}
      </Stack>
      <Button
        variant="contained"
        sx={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
        }}
      >
        <Link to="/posts/create">Create</Link>
      </Button>
    </Container>
  );
};

export default Posts;
