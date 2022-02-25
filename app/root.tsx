import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import {
  ActionFunction,
  Form,
  json,
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import useSession from "./hooks/use.session";
import User from "./models/user.model";
import { destroySession, getSession } from "./session";
import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

const guestOnlyRoutes = ["login", "register"];
const authRoutes = ["posts"];

export const loader: LoaderFunction = async ({ request }) => {
  return await useSession(session => {
    const user = session.get("current-user") as User | null;

    if (user && guestOnlyRoutes.some(it => request.url.includes(it))) {
      return redirect("/posts");
    }

    if (!user && authRoutes.some(it => request.url.includes(it))) {
      return redirect("/login");
    }

    return json(user ?? false);
  }, request);
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function App() {
  const user = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppBar position="sticky">
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            {user ? (
              <>
                <Button variant="text" color="inherit">
                  <Link to="/posts">Posts</Link>
                </Button>
                <Form method="post">
                  <Button type="submit" variant="text" color="inherit">
                    Logout
                  </Button>
                </Form>
              </>
            ) : (
              <Button variant="text" color="inherit">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Box my={4} />

        <main>
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
