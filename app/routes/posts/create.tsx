import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ActionFunction,
  Form,
  json,
  Link,
  redirect,
  useActionData,
} from "remix";
import { v4 } from "uuid";
import useSession from "~/hooks/use.session";
import Post from "~/models/post.model";
import User from "~/models/user.model";

export const action: ActionFunction = async ({ request }) => {
  return await useSession(async session => {
    const data = await request.formData();
    const user = session.get("current-user") as User;
    const posts = (session.get("posts") ?? []) as Post[];
    const title = data.get("title") as string;
    const content = data.get("content") as string;

    const errors = {
      title: [!title && "Title must not be empty."].filter(x => x),
      content: [!content && "Content must not be empty."].filter(x => x),
    };

    const isOk = Object.values(errors).every(it => it.length === 0);
    if (isOk) {
      const newPost = new Post(v4(), title, content, new Date(), user);
      session.set("posts", [...posts, newPost]);
      return redirect("/posts");
    }

    return json(errors, { status: 400 });
  }, request);
};

const PostsCreate = () => {
  const errors = useActionData<{
    title: string[];
    content: string[];
  }>();

  return (
    <Box>
      <Container maxWidth="xs">
        <Typography variant="h4">Create Post</Typography>
        <Form method="post">
          <Stack spacing={2}>
            <TextField
              error={!!errors?.title?.length}
              helperText={errors?.title?.[0]}
              type="text"
              label="Title"
              name="title"
            />
            <TextField
              error={!!errors?.content?.length}
              helperText={errors?.content?.[0]}
              type="text"
              multiline
              minRows={7}
              label="Content"
              name="content"
            />
            <Button type="submit" variant="contained">
              Create
            </Button>
            <Button variant="outlined" color="error">
              <Link to="/posts">Cancel</Link>
            </Button>
          </Stack>
        </Form>
      </Container>
    </Box>
  );
};

export default PostsCreate;
