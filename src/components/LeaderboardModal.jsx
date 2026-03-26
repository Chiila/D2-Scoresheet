import { useEffect } from 'react'
import { getRankedTeams } from '../utils/consolidation'

const PLACE_STYLES = [
  {
    label: '1st',
    ring: 'ring-pink-400/90',
    bg: 'from-pink-100 via-rose-50 to-fuchsia-100 dark:from-pink-900/55 dark:via-rose-950/40 dark:to-fuchsia-900/45',
    accent: 'text-pink-600 dark:text-pink-300',
    crown: '👑',
  },
  {
    label: '2nd',
    ring: 'ring-fuchsia-300/90',
    bg: 'from-fuchsia-100/95 to-pink-50/90 dark:from-fuchsia-900/45 dark:to-pink-950/35',
    accent: 'text-fuchsia-700 dark:text-fuchsia-200',
    crown: '✨',
  },
  {
    label: '3rd',
    ring: 'ring-rose-300/90',
    bg: 'from-rose-100/95 to-pink-50/80 dark:from-rose-900/45 dark:to-pink-950/30',
    accent: 'text-rose-700 dark:text-rose-200',
    crown: '💖',
  },
]

export default function LeaderboardModal({ open, onClose, submissions }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const ranked = getRankedTeams(submissions)
  const top = ranked.slice(0, 3)
  const hasScores = ranked.some((r) => r.grandTotal !== null)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-pink-950/55 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close rankings"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border-2 border-pink-300/70 bg-gradient-to-b from-pink-950 via-fuchsia-950 to-purple-950 shadow-2xl shadow-pink-600/30 dark:border-pink-500/30">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-pink-400/25 to-transparent" />
        <div className="relative px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-300/95">
                HERmazing Race
              </p>
              <h2
                id="leaderboard-title"
                className="font-heading mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                Rankings 💕
              </h2>
              <p className="mt-1 text-sm text-pink-200/90">
                Sorted by grand total (latest score per station).
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-pink-400/50 bg-pink-500/20 px-4 py-2 text-sm font-semibold text-pink-100 transition hover:bg-pink-500/35"
            >
              Close
            </button>
          </div>

          {!hasScores ? (
            <p className="mt-8 rounded-2xl border border-pink-700/50 bg-pink-950/50 px-4 py-6 text-center text-sm text-pink-200">
              No scores yet — add a submission to see the sparkly podium!
            </p>
          ) : (
            <ol className="mt-8 space-y-4">
              {top.map((row, i) => {
                const style = PLACE_STYLES[i]
                return (
                  <li
                    key={row.teamId}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-r p-4 ring-2 ${style.ring} ${style.bg}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl shadow-inner dark:bg-pink-950/50"
                          aria-hidden
                        >
                          {style.crown}
                        </span>
                        <div>
                          <p
                            className={`text-xs font-bold uppercase tracking-wider ${style.accent}`}
                          >
                            {style.label} place
                          </p>
                          <p className="font-heading text-lg font-bold text-pink-950 dark:text-pink-50">
                            <span className="mr-1" aria-hidden>
                              {row.teamEmoji}
                            </span>
                            {row.teamName}
                          </p>
                        </div>
                      </div>
                      <p className="text-right">
                        <span className="block text-xs font-bold uppercase text-pink-600 dark:text-pink-400">
                          Total
                        </span>
                        <span className="text-2xl font-black tabular-nums text-pink-950 dark:text-pink-100">
                          {row.total}
                        </span>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}

          {hasScores && ranked.length > 3 && (
            <div className="mt-6 max-h-40 overflow-y-auto rounded-2xl border border-pink-800/50 bg-pink-950/40 px-3 py-2">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-pink-400">
                Full order
              </p>
              <ul className="space-y-1 text-sm text-pink-100">
                {ranked.map((row, idx) => (
                  <li
                    key={row.teamId}
                    className="flex justify-between border-b border-pink-800/40 py-1.5 last:border-0"
                  >
                    <span>
                      #{idx + 1} — {row.teamEmoji} {row.teamName}
                    </span>
                    <span className="tabular-nums font-semibold text-rose-200/95">
                      {row.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
