import Link from "next/link";

// Shown when a page calls unauthorized(): the user is not logged in
export default function Unauthorized() {
  return (
    <main>
      <h1>Log in first</h1>
      <p>You need to be logged in to see this page.</p>
      <p>
        <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
