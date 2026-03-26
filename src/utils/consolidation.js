import { STATIONS, TEAMS, normalizeTeamId } from '../data/stations'

/** Latest submission wins per (team, station). */
export function latestByTeamStation(submissions) {
  const map = new Map()
  const sorted = [...submissions].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  )
  for (const s of sorted) {
    const tid = normalizeTeamId(s.team)
    if (!tid) continue
    map.set(`${tid}-${s.station}`, s)
  }
  return map
}

export function sumStationScores(submission, stationId) {
  if (!submission) return null
  const def = STATIONS[stationId]
  if (!def) return null
  return def.criteria.reduce(
    (sum, c) => sum + (Number(submission.scores[c.key]) || 0),
    0,
  )
}

export function getConsolidationRows(submissions) {
  const latest = latestByTeamStation(submissions)
  return TEAMS.map((t) => {
    const tid = t.id
    const t1 = latest.get(`${tid}-1`)
    const t2 = latest.get(`${tid}-2`)
    const t3 = latest.get(`${tid}-3`)
    const t4 = latest.get(`${tid}-4`)
    const t5 = latest.get(`${tid}-5`)
    const s1 = sumStationScores(t1, 1)
    const s2 = sumStationScores(t2, 2)
    const s3 = sumStationScores(t3, 3)
    const s4 = sumStationScores(t4, 4)
    const s5 = sumStationScores(t5, 5)
    const parts = [s1, s2, s3, s4, s5].filter((v) => v !== null)
    const grandTotal =
      parts.length === 0 ? null : parts.reduce((a, b) => a + b, 0)
    return {
      teamId: tid,
      teamName: t.name,
      teamEmoji: t.emoji,
      s1,
      s2,
      s3,
      s4,
      s5,
      grandTotal,
    }
  })
}

export function getRankedTeams(submissions) {
  const rows = getConsolidationRows(submissions)
  const withTotals = rows
    .map((r) => ({
      ...r,
      total: r.grandTotal ?? 0,
      team: r.teamId,
    }))
    .sort((a, b) => b.total - a.total)
  return withTotals
}
