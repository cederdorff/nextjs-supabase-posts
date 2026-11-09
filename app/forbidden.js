import Link from "next/link";

// Shown when a page calls forbidden(): the user is logged in, but doesn't have the role
export default function Forbidden() {
  return (
    <main>
      <h1>No access</h1>
      <p>You are logged in, but only admins can see this page.</p>
      <p>
        <Link href="/">Go to the posts</Link>
      </p>
    </main>
  );
}
