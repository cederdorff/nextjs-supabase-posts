import styles from "./UserBadge.module.css";

// The user's image, name and title. New users have no image, so we show their first letter.
export default function UserBadge({ user }) {
  return (
    <div className={styles.badge}>
      {user.image ? (
        <img src={user.image} alt="" className={styles.avatar} />
      ) : (
        <span className={styles.avatar} aria-hidden="true">
          {user.name.charAt(0)}
        </span>
      )}
      <div>
        <p className={styles.name}>{user.name}</p>
        {user.title && <p className={styles.title}>{user.title}</p>}
      </div>
    </div>
  );
}
