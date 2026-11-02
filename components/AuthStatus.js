import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/lib/actions";
import styles from "./AuthStatus.module.css";

// Shows the email and Log out when the user is logged in – or Log in when not
export default async function AuthStatus() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link href="/login" className={styles.login}>
        Log in
      </Link>
    );
  }

  return (
    <div className={styles.status}>
      <Link href="/profile" className={styles.email}>
        {user.email}
      </Link>
      <form action={signOut}>
        <button type="submit" className={styles.logout}>
          Log out
        </button>
      </form>
    </div>
  );
}
