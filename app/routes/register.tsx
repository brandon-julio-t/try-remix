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
import User from "~/models/user.model";

export const action: ActionFunction = async ({ request }) => {
  return await useSession(async session => {
    const data = await request.formData();
    const users = (session.get("users") ?? []) as User[];
    const name = data.get("name")?.toString() ?? "";
    const email = data.get("email")?.toString() ?? "";
    const password = data.get("password")?.toString() ?? "";

    const user = users.filter(user => user.email === email)[0];

    if (!user) {
      const newUser = new User(v4(), name, email, password);
      session.set("users", [...users, newUser]);
      return redirect("/login");
    }

    const errors = {
      name: [!name && "Name must not be empty."].filter(x => x),
      email: [
        !email && "Email must not be empty.",
        user && "Email already exists.",
      ].filter(x => x),
      password: [!password && "Password must not be empty."].filter(x => x),
    };

    return json(errors, { status: 400 });
  }, request);
};

const Register = () => {
  const errors = useActionData<{
    name: string[];
    email: string[];
    password: string[];
  } | null>();

  return (
    <Box my={8}>
      <Container maxWidth="xs">
        <Typography variant="h4" my={2}>
          Register
        </Typography>
        <Form method="post">
          <Stack spacing={2}>
            <TextField
              type="text"
              error={!!errors?.name?.length}
              helperText={errors?.name?.[0]}
              label="Name"
              name="name"
            />
            <TextField
              type="email"
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
              Register
            </Button>
            <Button variant="outlined">
              <Link to="/login">Already has an account? Login</Link>
            </Button>
          </Stack>
        </Form>
      </Container>
    </Box>
  );
};

export default Register;
