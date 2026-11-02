import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Create post",
};

async function createPost(formData) {
  "use server";

  // The Server Action can be called without the page, so it checks the user too
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    caption: formData.get("caption").trim(),
    image: formData.get("image").trim(),
    // The id comes from the session on the server – never from the form
    user_id: user.sub,
  });

  if (error) {
    redirect("/create?error=true");
  }

  redirect("/");
}

export default async function CreatePage({ searchParams }) {
  const { error } = await searchParams;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Create post</h1>
      {error && (
        <p className="form-error" role="alert">
          Could not create the post.
        </p>
      )}
      <form action={createPost} className="form">
        <label htmlFor="image">Image URL</label>
        <input id="image" name="image" type="url" placeholder="https://..." required />

        <label htmlFor="caption">Caption</label>
        <textarea id="caption" name="caption" rows="4" placeholder="Write a caption for your post..." required />

        <button type="submit">Save</button>
      </form>
    </main>
  );
}
