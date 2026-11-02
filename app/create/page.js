import { redirect } from "next/navigation";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Create post",
};

async function createPost(formData) {
  "use server";

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    caption: formData.get("caption").trim(),
    image: formData.get("image").trim(),
    user_id: CURRENT_USER_ID,
  });

  if (error) {
    redirect("/create?error=true");
  }

  redirect("/");
}

export default async function CreatePage({ searchParams }) {
  const { error } = await searchParams;

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
