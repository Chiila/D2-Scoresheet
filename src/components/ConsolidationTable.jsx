import { STATIONS } from '../data/stations'
import { getConsolidationRows } from '../utils/consolidation'

function Cell({ value }) {
  if (value === null) {
    return <span className="text-pink-300 dark:text-pink-700">—</span>
  }
  return <span className="tabular-nums font-semibold text-pink-900 dark:text-pink-100">{value}</span>
}

export default function ConsolidationTable({ submissions }) {
  const rows = getConsolidationRows(submissions)

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-pink-200/80 bg-gradient-to-b from-white via-pink-50/50 to-rose-50/40 p-4 shadow-xl shadow-pink-200/30 sm:p-7 dark:border-pink-800/45 dark:from-pink-950/50 dark:via-purple-950/40 dark:to-rose-950/35 dark:shadow-none">
      <div
        className="pointer-events-none absolute right-4 top-4 text-3xl opacity-30"
        aria-hidden
      >
        👑
      </div>
      <h2 className="font-heading text-xl font-bold tracking-tight text-pink-950 dark:text-pink-100 sm:text-2xl">
        Master consolidation
      </h2>
      <p className="mt-1 text-sm text-pink-800/80 dark:text-pink-200/75">
        Latest score per team + station. Grand total adds every station that has
        been scored.
      </p>

      <div className="mt-5 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-pink-200 dark:border-pink-800/80">
              <th className="sticky left-0 z-10 bg-gradient-to-r from-pink-50 to-white py-3 pr-3 font-bold text-pink-900 dark:from-pink-950/95 dark:to-purple-950/95 dark:text-pink-100">
                Team
              </th>
              {[1, 2, 3, 4, 5].map((id) => (
                <th
                  key={id}
                  className="px-2 py-3 text-center font-bold text-pink-800 dark:text-pink-200"
                >
                  <span className="block text-fuchsia-600 dark:text-fuchsia-300">
                    {STATIONS[id].code}
                  </span>
                  <span className="block text-xs font-semibold text-pink-500 dark:text-pink-400">
                    {STATIONS[id].name}
                  </span>
                </th>
              ))}
              <th className="px-2 py-3 text-center font-bold text-rose-600 dark:text-rose-300">
                Grand total
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.teamId}
                className="border-b border-pink-100/90 dark:border-pink-900/60"
              >
                <td className="sticky left-0 z-10 bg-gradient-to-r from-pink-50/98 to-white/98 py-2.5 pr-3 font-semibold text-pink-950 dark:from-pink-950/98 dark:to-purple-950/98 dark:text-pink-50">
                  <span className="mr-1.5" aria-hidden>
                    {r.teamEmoji}
                  </span>
                  {r.teamName}
                </td>
                <td className="px-2 py-2.5 text-center">
                  <Cell value={r.s1} />
                </td>
                <td className="px-2 py-2.5 text-center">
                  <Cell value={r.s2} />
                </td>
                <td className="px-2 py-2.5 text-center">
                  <Cell value={r.s3} />
                </td>
                <td className="px-2 py-2.5 text-center">
                  <Cell value={r.s4} />
                </td>
                <td className="px-2 py-2.5 text-center">
                  <Cell value={r.s5} />
                </td>
                <td className="px-2 py-2.5 text-center">
                  {r.grandTotal === null ? (
                    <Cell value={null} />
                  ) : (
                    <span className="inline-block rounded-full bg-gradient-to-r from-pink-200 to-rose-200 px-3 py-1 tabular-nums text-sm font-bold text-pink-950 shadow-sm dark:from-pink-600/40 dark:to-rose-600/40 dark:text-pink-50">
                      {r.grandTotal}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
