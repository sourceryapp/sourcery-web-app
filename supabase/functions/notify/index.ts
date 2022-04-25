/** A reminder this uses a DENO runtime. */

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { supabaseClient, testJwtDecoder } from "../_utils/supabase.ts"

console.log("Hello from Functions!")
const url = Deno.env.get('API_URL')
console.log(`Serving from ${url}.`)
const userData = supabaseClient.auth.user()

serve(async (req) => {
  const { name } = await req.json()

  const authHeader = req.headers.get("Authorization")!;

  const data = {
    message: `Hello ${name}!`,
    header: authHeader,
    decoded: testJwtDecoder(authHeader),
    supabaseUrl: Deno.env.get('SUPABASE_URL'),
    user: userData
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
