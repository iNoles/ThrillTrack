import { serve } from "bun";
import { createClient } from "@supabase/supabase-js";

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to add CORS headers
function withCORS(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle preflight
    if (req.method === "OPTIONS") {
      return withCORS(new Response("OK"));
    }

    // GET /rides
    if (url.pathname === "/rides") {
      const { data, error } = await supabase
        .from("rides")
        .select(
          "id, name, park, status, type, description, opening_year, manufacturer, height_requirement, thrill_rating"
        );

      if (error) {
        return withCORS(
          new Response(JSON.stringify({ error: error.message }), {
            status: 500,
          })
        );
      }

      // Make sure type is always an array
      const rows = data?.map((r: any) => ({
        ...r,
        type: Array.isArray(r.type) ? r.type : r.type?.split(",") || [],
      }));

      return withCORS(new Response(JSON.stringify(rows), { status: 200 }));
    }

    // GET /rides/:id
    if (url.pathname.startsWith("/rides/")) {
      const id = Number(url.pathname.split("/")[2]);
      if (isNaN(id)) {
        return withCORS(
          new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 })
        );
      }

      const { data, error } = await supabase
        .from("rides")
        .select(
          "id, name, park, status, type, description, opening_year, manufacturer, height_requirement, thrill_rating"
        )
        .eq("id", id)
        .single();

      if (error || !data) {
        return withCORS(
          new Response(JSON.stringify({ error: "Ride not found" }), {
            status: 404,
          })
        );
      }

      // Ensure type is array
      const ride = {
        ...data,
        type: Array.isArray(data.type) ? data.type : data.type?.split(",") || [],
      };

      return withCORS(new Response(JSON.stringify(ride), { status: 200 }));
    }

    return withCORS(new Response("Not Found", { status: 404 }));
  },
});

console.log("🚀 Bun Supabase API running at http://localhost:3000");
