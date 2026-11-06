// Simplified → Traditional (Taiwan) for PCafe text: OpenCC `cn → twp` plus a
// small table of PCafe terms. Shared by scripts/zh-tw.mjs (docs) and the site.
import * as OpenCC from 'opencc-js'

const toTw = OpenCC.Converter({ from: 'cn', to: 'twp' })

// PCafe's Taiwan wording, applied after OpenCC (Traditional on both sides).
// Longest first, so a phrase wins over the word inside it.
const TERMS = [
  ['新建', '建立'],
  ['演示', '簡報'],
  ['模板', '範本'],
  ['生成', '產生'],
  ['釋出', '發布'],
  ['構建', '建置'],
  ['命令', '指令'],
  ['數據', '資料'],
  ['渠道', '通路'],
  ['當前', '目前'],
  ['計劃', '計畫'],
  ['規劃', '規畫'],
  ['豎版', '直向'],
  ['展示屏', '展示螢幕'],
  ['大屏', '大螢幕'],
  ['彙報', '簡報'],
  ['示例', '範例'],
  ['簡歷', '履歷'],
  ['自定義', '自訂'],
  ['三摺頁', '三折頁'],
  ['摺頁', '折頁'],
  ['幻燈片', '投影片'],
  ['指令碼', '腳本'],
  ['燒屏', '烙印'],
  ['質量', '品質'],
  ['臺', '台'],
  ['賬', '帳'],
  ['融資路演', '募資簡報'],
  ['融資', '募資'],
  ['路演', '募資簡報'],
  ['聯網', '連網'],
  ['配置', '設定'],
  ['豎屏', '直式'],
  ['橫屏', '橫式'],
  ['許可證', '授權'],
  ['增長', '成長'],
  ['郵箱', '信箱'],
  ['佔比', '占比'],
  ['分佈', '分布'],
  ['自下而上', '由下而上'],
  ['文字框', '文字方塊'],
  ['文本框', '文字方塊'],
  ['拖拽', '拖拉'],
  ['倉庫', '儲存庫'],
  ['這隻能', '這只能'], ['不是隻靠', '不是只靠'], ['隻影響', '只影響'], ['幾隻資料夾', '幾個資料夾'], ['下一隻', '下一個'],
  ['運營', '營運'], ['吊銷', '撤銷'], ['客戶門戶', '客戶入口網站'], ['門戶', '入口網站'],
].sort((a, b) => b[0].length - a[0].length)

const QUOTES = [
  ['“', '「'],
  ['”', '」'],
  ['‘', '『'],
  ['’', '』'],
]

/** Converts text only; links are left alone. */
export function toTraditional(text) {
  let out = toTw(text)
  for (const [a, b] of TERMS) out = out.replaceAll(a, b)
  for (const [a, b] of QUOTES) out = out.replaceAll(a, b)
  return out
}

