import { createClient } from "@supabase/supabase-js";

export default async function handler(request, response) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  if (!email) {
    return response.status(400).json({ access: false });
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return response.json({ access: false });
  }

  const now = new Date();
  const expires = new Date(user.expires_at);

  if (user.status === "active" && now <= expires) {
    return response.json({ access: true });
  }

  return response.json({ access: false });
}
