import { useEffect, useState } from 'react'
import { STATIONS, STATION_IDS, TEAMS } from '../data/stations'

function emptyScoresForStation(stationId) {
  const def = STATIONS[stationId]
  if (!def) return {}
  return Object.fromEntries(def.criteria.map((c) => [c.key, '']))
}

export default function StationForm({ onSubmit }) {
  const [team, setTeam] = useState('')
  const [station, setStation] = useState('')
  const [facilitatorName, setFacilitatorName] = useState('')
  const [timeCompleted, setTimeCompleted] = useState('')
  const [scores, setScores] = useState({})
  const [formError, setFormError] = useState('')

  const stationNum = station === '' ? null : Number(station)
  const stationDef = stationNum ? STATIONS[stationNum] : null

  useEffect(() => {
    if (stationNum) {
      setScores(emptyScoresForStation(stationNum))
      setFormError('')
    }
  }, [stationNum])

  function handleScoreChange(key, raw, max) {
    if (raw === '') {
      setScores((prev) => ({ ...prev, [key]: '' }))
      return
    }
    const n = Number(raw)
    if (Number.isNaN(n)) {
      setScores((prev) => ({ ...prev, [key]: raw }))
      return
    }
    const clamped = Math.min(Math.max(0, n), max)
    setScores((prev) => ({ ...prev, [key]: String(clamped) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!team || !stationNum || !stationDef) {
      setFormError('Pick a team and station, bestie 💕')
      return
    }
    const name = facilitatorName.trim()
    if (!name) {
      setFormError('Add your name as the facilitator scoring this team.')
      return
    }
    const timeNote = timeCompleted.trim()
    if (!timeNote) {
      setFormError(
        'Add how long they took (e.g. 10 mins, 8 minutes, 1h 5m).',
      )
      return
    }

    const parsed = {}
    for (const c of stationDef.criteria) {
      const raw = scores[c.key]
      if (raw === '' || raw === undefined) {
        setFormError(`Enter a score for “${c.label}”.`)
        return
      }
      const n = Number(raw)
      if (Number.isNaN(n) || n < 0 || n > c.max) {
        setFormError(
          `“${c.label}” must be between 0 and ${c.max} (cannot exceed max).`,
        )
        return
      }
      parsed[c.key] = n
    }

    const result = onSubmit({
      team,
      station: stationNum,
      scores: parsed,
      facilitatorName: name,
      timeCompleted: timeNote,
    })
    const ok = await Promise.resolve(result)
    if (ok !== false) {
      setScores(emptyScoresForStation(stationNum))
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-2xl border-2 border-pink-200/90 bg-white/95 px-3 py-2.5 text-pink-950 shadow-sm outline-none transition placeholder:text-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-200/50 dark:border-pink-400/30 dark:bg-pink-950/40 dark:text-pink-50 dark:placeholder:text-pink-500/60 dark:focus:border-pink-300 dark:focus:ring-pink-500/20'

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-pink-200/80 bg-gradient-to-br from-pink-50 via-white to-rose-50 p-4 shadow-xl shadow-pink-200/40 sm:p-7 dark:border-pink-800/50 dark:from-pink-950/80 dark:via-purple-950/60 dark:to-rose-950/50 dark:shadow-pink-900/20">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pink-200/40 blur-2xl dark:bg-pink-500/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-rose-200/50 blur-2xl dark:bg-rose-500/15"
        aria-hidden
      />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
          ✨ Score sheet
        </p>
        <h2 className="font-heading mt-1 text-xl font-bold tracking-tight text-pink-950 dark:text-pink-100 sm:text-2xl">
          Station scoring
        </h2>
        <p className="mt-1 text-sm text-pink-800/85 dark:text-pink-200/80">
          Choose the crew, add your name & how long they took (words + numbers
          are fine), then enter scores (each ≤ max points).
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300">
                Team
              </span>
              <select className={inputClass} value={team} onChange={(e) => setTeam(e.target.value)}>
                <option value="">Choose a team…</option>
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.emoji} {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300">
                Station
              </span>
              <select
                className={inputClass}
                value={station}
                onChange={(e) => setStation(e.target.value)}
              >
                <option value="">Choose a station…</option>
                {STATION_IDS.map((id) => (
                  <option key={id} value={id}>
                    {STATIONS[id].code} — {STATIONS[id].name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300">
                Facilitator (you’re scoring them)
              </span>
              <input
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className={inputClass}
                value={facilitatorName}
                onChange={(e) => setFacilitatorName(e.target.value)}
              />
            </label>
            <label className="block text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300">
                Time / duration completed
              </span>
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                placeholder="e.g. 10 mins, 8 minutes, 1h 5m"
                aria-describedby="time-completed-hint"
                className={inputClass}
                value={timeCompleted}
                onChange={(e) => setTimeCompleted(e.target.value)}
              />
              <span
                id="time-completed-hint"
                className="mt-1 block text-xs text-pink-600/80 dark:text-pink-400/90"
              >
                Type whatever makes sense — clock time, minutes, or a short
                phrase.
              </span>
            </label>
          </div>

          {stationDef && (
            <div className="space-y-3 rounded-2xl border-2 border-rose-200/80 bg-gradient-to-br from-rose-50/95 via-pink-50/80 to-fuchsia-50/60 p-4 dark:border-rose-800/40 dark:from-rose-950/35 dark:via-pink-950/25 dark:to-fuchsia-950/25">
              <p className="text-sm font-bold text-rose-800 dark:text-rose-200">
                💖 {stationDef.code}: {stationDef.name}
              </p>
              <ul className="space-y-3">
                {stationDef.criteria.map((c) => (
                  <li
                    key={c.key}
                    className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <span className="min-w-0 flex-1 text-sm font-medium text-pink-900 dark:text-pink-100">
                      {c.label}
                      <span className="ml-2 text-xs font-normal text-pink-500 dark:text-pink-400">
                        (max {c.max})
                      </span>
                    </span>
                    <div className="flex items-center gap-2 sm:w-40">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={c.max}
                        step="0.5"
                        aria-label={`${c.label} score out of ${c.max}`}
                        className="w-full rounded-xl border-2 border-pink-200 bg-white px-3 py-2 text-right text-pink-950 tabular-nums outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-200/50 dark:border-pink-600/40 dark:bg-pink-950/50 dark:text-pink-50 dark:focus:ring-pink-500/25"
                        value={scores[c.key] ?? ''}
                        onChange={(e) =>
                          handleScoreChange(c.key, e.target.value, c.max)
                        }
                        onBlur={(e) => {
                          const v = e.target.value
                          if (v === '') return
                          const n = Number(v)
                          if (Number.isNaN(n)) return
                          handleScoreChange(c.key, String(n), c.max)
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {formError && (
            <p
              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
              role="alert"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={!stationDef}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-400/35 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
          >
            Save submission 💕
          </button>
        </form>
      </div>
    </section>
  )
}
