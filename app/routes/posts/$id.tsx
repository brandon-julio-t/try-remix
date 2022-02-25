import { Container, Typography } from "@mui/material";
import { json, LoaderFunction, useLoaderData } from "remix"
import useSession from "~/hooks/use.session";
import Post from "~/models/post.model";

export const loader: LoaderFunction = async ({ request, params }) => {
  return await useSession(async session => {
    const { id } = params;
    const posts = (session.get("posts") ?? []) as Post[];
    const post = posts.filter(post => post.id === id)[0];
    return json(post);
  }, request);
}

const PostDetail = () => {
  const post = useLoaderData();
  return (
    <Container maxWidth="sm">
      <Typography variant="h4">{post.title}</Typography>
      <Typography variant="body2">{post.createdAt} &mdash; {post?.user?.name ?? 'Unknown'}</Typography>
      <Typography variant="body1">{post.content}</Typography>
    </Container>
  )
}

export default PostDetail
