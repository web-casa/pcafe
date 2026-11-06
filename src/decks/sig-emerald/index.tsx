import type { DeckDef } from '../../kit'
import { MethodSteps, Statement } from '../../kit'

export const deck: DeckDef = {
  title: '翡翠 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'emerald',
  slides: [
    {
      id: 'method',
      label: '方法步骤',
      build: 'reveal',
      render: () => (
        <MethodSteps
          kicker="工作方法"
          title="做一份演示的四步"
          lead="每一步都有明确的产出，下一步从上一步的产出开始。"
          steps={[
            { title: '列故事线', body: '先写每页要说的一句话，再决定页数和顺序。', who: '作者', when: '大纲' },
            { title: '配模板', body: '按内容的形状挑模板，对照内容上限检查字数。', who: '作者 + AI', when: '模板表' },
            { title: '写 deck 文件', body: '只组合模板，事实写明出处，查不到的不写。', who: 'AI', when: 'index.tsx' },
            { title: '检查看图', body: 'check 输出 PASS 后，逐页看截图再交付。', who: '作者', when: 'PASS' },
          ]}
          source="skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'about',
      label: '这种风格',
      render: () => (
        <Statement
          kicker="翡翠 · MethodSteps"
          text={['每一步，', '写清谁来做。']}
          sub="深浅交替的步骤卡，底部写负责人和产出，适合工作方法和协作流程。"
        />
      ),
    },
  ],
}
