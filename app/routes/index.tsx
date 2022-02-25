import { Link, Outlet } from 'remix';

export default function Index() {
  return (
    <>
      <nav>
        <Link to="/posts">Posts</Link>
        <Link to="/login">Login</Link>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}
