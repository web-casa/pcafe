import type { Session } from '../../screen'

export interface EventData {
  sessions: Session[]
  notices: { text: string; when?: { from: string; to: string } }[]
}

// Invented for the demo. The event, the names, the rooms and the Wi-Fi details do not exist.
export const SAMPLE: EventData = {
  sessions: [
    { start: '09:00', end: '09:40', title: '这一年学到的事', who: '嘉宾 A', room: '主会场' },
    { start: '09:50', end: '10:30', title: '把新模型接进旧系统', who: '嘉宾 B', room: '主会场' },
    { start: '10:30', end: '10:50', title: '茶歇', room: '二层大厅', isBreak: true },
    { start: '10:50', end: '11:30', title: '一个小团队的上线记录', who: '嘉宾 C', room: '东厅' },
    { start: '11:40', end: '12:20', title: '线上故障复盘', who: '嘉宾 D', room: '西厅' },
    { start: '12:20', end: '13:30', title: '午餐', room: '二层餐厅', isBreak: true },
    { start: '13:30', end: '14:10', title: '让评测跑在每次提交上', who: '嘉宾 E', room: '东厅' },
    { start: '14:20', end: '15:00', title: '开放讨论：工具与人', who: '嘉宾 F', room: '主会场' },
    { start: '15:10', end: '15:50', title: '明年的三件事', who: '嘉宾 G', room: '主会场' },
    { start: '15:50', end: '16:20', title: '闭幕', room: '主会场' },
  ],
  notices: [
    { text: '东厅今天下午有座位，西厅已坐满', when: { from: '11:00', to: '14:30' } },
    { text: '午餐券在签到台领取', when: { from: '08:30', to: '13:00' } },
    { text: '资料包在一层服务台领取' },
    { text: '离场请走一层北门', when: { from: '15:30', to: '23:00' } },
  ],
}

/** Rejects a malformed data file, so the screen keeps the last good one. */
export function parseEvent(raw: unknown): EventData {
  const r = raw as Partial<EventData> | null
  if (!r || !Array.isArray(r.sessions) || !Array.isArray(r.notices)) throw new Error('expected { sessions: [], notices: [] }')
  for (const s of r.sessions) {
    if (typeof s?.title !== 'string' || !/^\d{1,2}:\d{2}$/.test(s.start) || !/^\d{1,2}:\d{2}$/.test(s.end)) throw new Error('a session needs start, end and title')
  }
  return r as EventData
}
