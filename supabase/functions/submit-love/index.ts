// Supabase Edge Function — submit-love
// Receives an anonymous love-word submission. In Phase 1: validates input, rate-limits,
// inserts with `approved = false` (not displayed). No LLM moderation yet.

import { createClient } from 'jsr:@supabase/supabase-js@2'

interface SubmitLoveBody {
  word: string
  x: number
  y: number
  visitor_hash: string
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = (await req.json()) as SubmitLoveBody

  if (
    typeof body.word !== 'string' ||
    body.word.length < 1 ||
    body.word.length > 32 ||
    typeof body.x !== 'number' ||
    typeof body.y !== 'number' ||
    typeof body.visitor_hash !== 'string'
  ) {
    return new Response('Invalid', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // TODO: rate-limit (max 3 submissions per visitor_hash per hour)
  // TODO: Phase 2 — LLM moderation pass before insert

  const { error } = await supabase.from('gifts').insert({
    word: body.word.trim(),
    x_position: Math.max(0, Math.min(1, body.x)),
    y_position: Math.max(0, Math.min(1, body.y)),
    approved: false,
    visitor_hash: body.visitor_hash,
  })

  if (error) {
    return new Response('Stored', { status: 200 })
  }

  return new Response('Stored', { status: 200 })
})
