import { useCallback, useEffect, useState } from 'react'
import ConsolidationTable from './components/ConsolidationTable.jsx'
import LeaderboardModal from './components/LeaderboardModal.jsx'
import StationForm from './components/StationForm.jsx'
import { STATIONS, getTeamDisplayName } from './data/stations.js'
import { isSupabaseConfigured } from './lib/supabaseClient.js'
import {
  deleteAllSubmissions,
  fetchSubmissions,
  insertSubmission,
  subscribeToSubmissions,
} from './lib/submissionsApi.js'

function formatSavedAt(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function App() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function initialLoad() {
      if (!isSupabaseConfigured()) {
        setLoadError(
          'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file (see .env.example).',
        )
        setLoading(false)
        return
      }

      const { data, error } = await fetchSubmissions()
      if (cancelled) return
      if (error) {
        setLoadError(error.message)
      } else {
        setSubmissions(data)
      }
      setLoading(false)
    }

    initialLoad()

    const unsubscribe = subscribeToSubmissions((rows) => {
      if (!cancelled) setSubmissions(rows)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const handleAddSubmission = useCallback(async (payload) => {
    setSubmitError(null)
    if (!isSupabaseConfigured()) {
      setSubmitError('Supabase is not configured.')
      return false
    }
    const { data, error } = await insertSubmission(payload)
    if (error) {
      setSubmitError(error.message)
      return false
    }
    if (data) {
      setSubmissions((prev) => {
        if (prev.some((s) => s.id === data.id)) return prev
        return [...prev, data]
      })
    }
    return true
  }, [])

  async function handleReset() {
    setSubmitError(null)
    const ok = window.confirm(
      'Reset all HERmazing Race data? This deletes every submission in Supabase for all facilitators.',
    )
    if (!ok) return
    if (!isSupabaseConfigured()) {
      setLoadError('Supabase is not configured.')
      return
    }
    const { error } = await deleteAllSubmissions()
    if (error) {
      window.alert(`Could not reset: ${error.message}`)
      return
    }
    setSubmissions([])
  }

  const recent = [...submissions].reverse().slice(0, 12)

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-6 pb-14 sm:px-6 sm:py-10">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-300/25 blur-3xl dark:bg-pink-500/10"
        aria-hidden
      />

      {loadError && (
        <div
          className="relative mb-6 rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-700 dark:bg-rose-950/60 dark:text-rose-100"
          role="alert"
        >
          {loadError}
        </div>
      )}

      {loading && (
        <p className="relative mb-6 text-center text-sm font-medium text-pink-700 dark:text-pink-300">
          Loading scores from Supabase…
        </p>
      )}

      <header className="relative mb-8 text-center sm:mb-10">
        <div
          className="mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-center gap-8 sm:mb-8 sm:gap-12"
          aria-label="Partner logos"
        >
          <img
            src="/AWSCC.png"
            alt="AWSCC"
            className="h-20 w-auto max-h-28 max-w-[min(88vw,340px)] object-contain object-center sm:h-28 sm:max-h-36 md:h-32 md:max-h-40"
            width={340}
            height={128}
            decoding="async"
          />
          <img
            src="/AWSUG%20logo.png"
            alt="AWS User Group"
            className="h-20 w-auto max-h-28 max-w-[min(88vw,340px)] object-contain object-center sm:h-28 sm:max-h-36 md:h-32 md:max-h-40"
            width={340}
            height={128}
            decoding="async"
          />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-500 dark:text-pink-300">
          Score management
        </p>
        <h1 className="font-heading mt-3 bg-gradient-to-r from-pink-600 via-fuchsia-500 to-rose-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl dark:from-pink-300 dark:via-fuchsia-300 dark:to-rose-300">
          HERmazing Race
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm font-medium text-pink-900/85 dark:text-pink-100/80">
          <span aria-hidden>💅</span> Facilitator HQ — score your faves, peek
          totals, crown the winners.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={() => setLeaderboardOpen(true)}
            className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-pink-400/35 transition hover:brightness-110"
          >
            View rankings ✨
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading || !isSupabaseConfigured()}
            className="rounded-full border-2 border-rose-300 bg-white/90 px-7 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-700 dark:bg-pink-950/50 dark:text-rose-200 dark:hover:bg-rose-950/40"
          >
            Reset all data
          </button>
        </div>
      </header>

      <div className="relative flex flex-col gap-8 lg:gap-10">
        {submitError && (
          <p
            className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-100"
            role="alert"
          >
            {submitError}
          </p>
        )}
        <StationForm onSubmit={handleAddSubmission} />
        <ConsolidationTable submissions={submissions} />

        {recent.length > 0 && (
          <section className="rounded-3xl border-2 border-pink-200/80 bg-white/80 p-4 shadow-lg shadow-pink-200/25 backdrop-blur-sm sm:p-6 dark:border-pink-800/50 dark:bg-pink-950/35 dark:shadow-none">
            <h2 className="font-heading text-lg font-bold text-pink-950 dark:text-pink-100 sm:text-xl">
              Recent submissions
            </h2>
            <p className="mt-1 text-sm text-pink-800/80 dark:text-pink-200/75">
              Who scored whom, how long they took, and when it was saved.
            </p>
            <ul className="mt-4 space-y-2">
              {recent.map((s) => {
                const st = STATIONS[s.station]
                const label = st ? `${st.code} (${st.name})` : `S${s.station}`
                const fac =
                  typeof s.facilitatorName === 'string'
                    ? s.facilitatorName
                    : ''
                const time =
                  typeof s.timeCompleted === 'string' ? s.timeCompleted : ''
                return (
                  <li
                    key={s.id}
                    className="flex flex-col gap-1 rounded-2xl border border-pink-100 bg-pink-50/80 px-4 py-3 text-sm dark:border-pink-900/50 dark:bg-pink-950/40 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2"
                  >
                    <span className="font-semibold text-pink-950 dark:text-pink-50">
                      {getTeamDisplayName(s.team)} · {label}
                    </span>
                    <span className="text-pink-700/90 dark:text-pink-200/85">
                      <span className="font-medium text-pink-600 dark:text-pink-300">
                        {fac || '—'}
                      </span>
                      {time ? (
                        <>
                          {' '}
                          · completed in{' '}
                          <span className="font-medium">{time}</span>
                        </>
                      ) : null}
                      <span className="mt-1 block text-xs text-pink-500 dark:text-pink-400 sm:mt-0 sm:inline sm:before:content-['_·_']">
                        saved {formatSavedAt(s.createdAt)}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>

      <footer className="relative mt-10 text-center text-xs font-medium text-pink-600/85 dark:text-pink-400/90">
        {submissions.length} submission{submissions.length === 1 ? '' : 's'} in
        Supabase (shared with all facilitators){' '}
        {isSupabaseConfigured() ? '☁️' : ''}
      </footer>

      <LeaderboardModal
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        submissions={submissions}
      />
    </div>
  )
}
