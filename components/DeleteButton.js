"use client";

// Client Component because window.confirm only exists in the browser.
// The button submits the surrounding form, which calls the Server Action.
export default function DeleteButton() {
  function handleClick(event) {
    const confirmed = window.confirm("Delete this post?");

    if (!confirmed) event.preventDefault();
  }

  return (
    <button type="submit" className="button button-danger" onClick={handleClick}>
      Delete
    </button>
  );
}
