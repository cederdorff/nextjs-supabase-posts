import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Edit post",
};

export default async function UpdatePage({ params, searchParams }) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();

  if (!post) {
    notFound();
  }

  // Only the one who wrote the post may edit it
  const user = await getCurrentUser();

  if (user?.sub !== post.user_id) {
    redirect(`/posts/${id}`);
  }

  async function updatePost(formData) {
    "use server";

    const user = await getCurrentUser();

    if (user?.sub !== post.user_id) {
      redirect(`/posts/${id}`);
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("posts")
      .update({
        caption: formData.get("caption").trim(),
        image: formData.get("image").trim(),
      })
      .eq("id", id);

    if (error) {
      redirect(`/posts/${id}/update?error=true`);
    }

    redirect(`/posts/${id}`);
  }

  return (
    <main>
      <h1>Edit post</h1>
      {error && (
        <p className="form-error" role="alert">
          Could not save the post.
        </p>
      )}
      <form action={updatePost} className="form">
        <label htmlFor="image">Image URL</label>
        <input id="image" name="image" type="url" defaultValue={post.image} required />

        <label htmlFor="caption">Caption</label>
        <textarea id="caption" name="caption" rows="4" defaultValue={post.caption} required />

        <button type="submit">Save</button>
      </form>
    </main>
  );
}
