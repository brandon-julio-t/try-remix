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
import useSession from "~/hooks/use.session";
import User from "~/models/user.model";

export const action: ActionFunction = async ({ request }) => {
  return await useSession(async session => {
    const data = await request.formData();
    const users = (session.get("users") ?? []) as User[];
    const email = data.get("email");
    const password = data.get("password");

    const user = users.filter(user => user.email === email)[0];
    const isAuth = user?.password === password;

    if (isAuth) {
      session.set("current-user", user);
      return redirect("/posts");
    }

    return json(
      {
        email: [
          !email && "Email must not be empty.",
          !user && "Email not found.",
        ].filter(x => x),
        password: [
          !password && "Password must not be empty.",
          !isAuth && "Invalid credentials.",
        ].filter(x => x),
      },
      { status: 400 }
    );
  }, request);
};

const Login = () => {
  const errors = useActionData<{
    email: string[];
    password: string[];
  }>();

  return (
    <Box my={8}>
      <Container maxWidth="xs">
        <Typography variant="h4" my={2}>
          Login
        </Typography>
        <Form method="post">
          <Stack spacing={2}>
            <TextField
              type="text"
              error={!!errors?.email?.length}
              helperText={errors?.email?.[0]}
              label="Email"
              name="email"
            />
            <TextField
              type="password"
              error={!!errors?.password?.length}
              helperText={errors?.password?.[0]}
              label="Password"
              name="password"
            />
            <Button type="submit" variant="contained">
              Login
            </Button>
            <Button variant="outlined">
              <Link to="/register">No account? Register</Link>
            </Button>
          </Stack>
        </Form>
      </Container>
    </Box>
  );
};

export default Login;
