import { normalizeTeamId } from '../data/stations'
import { supabase } from './supabaseClient'

/** @typedef {{ id: string, team: string, station: number, scores: Record<string, number>, facilitatorName: string, timeCompleted: string, createdAt: string }} Submission */

function rowToSubmission(row) {
  if (!row) return null
  const team = normalizeTeamId(row.team)
  if (!team) return null
  return {
    id: row.id,
    team,
    station: Number(row.station),
    scores:
      row.scores && typeof row.scores === 'object' && !Array.isArray(row.scores)
        ? row.scores
        : {},
    facilitatorName:
      typeof row.facilitator_name === 'string' ? row.facilitator_name : '',
    timeCompleted:
      typeof row.time_completed === 'string' ? row.time_completed : '',
    createdAt:
      typeof row.created_at === 'string'
        ? row.created_at
        : new Date(row.created_at).toISOString(),
  }
}

/**
 * @returns {Promise<{ data: Submission[], error: Error | null }>}
 */
export async function fetchSubmissions() {
  if (!supabase) {
    return { data: [], error: new Error('Supabase is not configured') }
  }
  const { data, error } = await supabase
    .from('submissions')
    .select(
      'id, team, station, scores, facilitator_name, time_completed, created_at',
    )
    .order('created_at', { ascending: true })

  if (error) {
    return { data: [], error: new Error(error.message) }
  }
  const list = (data || [])
    .map(rowToSubmission)
    .filter(Boolean)
  return { data: list, error: null }
}

/**
 * @param {{ team: string, station: number, scores: Record<string, number>, facilitatorName: string, timeCompleted: string }} payload
 * @returns {Promise<{ data: Submission | null, error: Error | null }>}
 */
export async function insertSubmission(payload) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured') }
  }
  const row = {
    team: payload.team,
    station: payload.station,
    scores: payload.scores,
    facilitator_name: payload.facilitatorName,
    time_completed: payload.timeCompleted,
  }
  const { data, error } = await supabase
    .from('submissions')
    .insert(row)
    .select(
      'id, team, station, scores, facilitator_name, time_completed, created_at',
    )
    .single()

  if (error) {
    return { data: null, error: new Error(error.message) }
  }
  return { data: rowToSubmission(data), error: null }
}

export async function deleteAllSubmissions() {
  if (!supabase) {
    return { error: new Error('Supabase is not configured') }
  }
  const nil = '00000000-0000-0000-0000-000000000000'
  const { error } = await supabase.from('submissions').delete().neq('id', nil)
  return { error: error ? new Error(error.message) : null }
}

/**
 * @param {(rows: Submission[]) => void} onChange
 * @returns {() => void} unsubscribe
 */
export function subscribeToSubmissions(onChange) {
  if (!supabase) {
    return () => {}
  }

  let cancelled = false

  async function refresh() {
    const { data, error } = await fetchSubmissions()
    if (!cancelled && !error) onChange(data)
  }

  const channel = supabase
    .channel('hermazing-submissions')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'submissions' },
      () => {
        refresh()
      },
    )
    .subscribe()

  return () => {
    cancelled = true
    supabase.removeChannel(channel)
  }
}
