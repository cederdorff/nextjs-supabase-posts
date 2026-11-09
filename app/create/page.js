import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Create post",
};

async function createPost(formData) {
  "use server";

  // The Server Action can be called without the page, so it checks the user too
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  // In Post App: fetch(`${url}/posts`, { method: "POST", body: JSON.stringify(post) })
  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    caption: formData.get("caption").trim(),
    image: formData.get("image").trim(),
    // The logged-in user – never an id from the form
    userId: profile.id,
  });

  if (error) {
    redirect("/create?error=true");
  }

  redirect("/");
}

export default async function CreatePage({ searchParams }) {
  const { error } = await searchParams;

  const profile = await getCurrentProfile();

  if (!profile) {
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
