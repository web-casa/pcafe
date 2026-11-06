// A starting point: copy this folder, change the words, then run the check.
// Every wrong answer needs its own explanation, because feedback that explains is what teaches.
// Field limits: src/course/types.ts and src/course/validate.ts. Why: docs/en/course.md.
import { Bullets, Lead, P, type CourseDef } from '../../course'

export const course: CourseDef = {
  id: 'starter',
  title: '我的课程',
  lead: '一句话说明学完能做什么。这是起始模板，换成你的内容。',
  lang: 'zh',
  theme: 'cobalt',
  look: 'editorial',
  minutes: [3, 5],
  objectives: ['说清这门课的核心概念', '在一个具体情境里用上它', '知道下一步该学什么'],
  concepts: {
    idea: { label: '核心概念', review: 'r-idea' },
  },
  sources: {
    source: { org: '作者', title: '换成真实出处：谁写的、标题、链接和查阅日期' },
  },
  sections: [
    {
      id: 's-idea',
      title: '一个概念',
      steps: [
        {
          kind: 'read',
          id: 'r-idea',
          title: '每一步只讲一个想法',
          illustrative: true,
          cites: [],
          blocks: [
            <Lead key="lead">讲解页要短。能用一张说明图讲清楚的，就不要写成一大段。</Lead>,
            <P key="p">写讲解之前先写练习题，这样你会知道学习者到底需要读到什么。</P>,
            <Bullets key="list" items={['一步一个想法', '有外部事实就写出处', '放不下就拆成两步']} />,
          ],
        },
        {
          kind: 'practice',
          id: 'p-one',
          concept: 'idea',
          cites: ['source'],
          exercise: {
            type: 'single',
            prompt: '一段讲解太长、一屏放不下，应该怎么办？',
            options: [
              { text: '拆成两步', correct: true, why: '对。一步只讲一个想法，读完马上能练，也更容易回看。' },
              { text: '把字号改小', why: '字变小以后手机上读不了，内容的负担也没有减少。' },
              { text: '删掉练习题，留出位置', why: '练习才是学习发生的地方，应该留下它，再去精简讲解。' },
            ],
          },
        },
        {
          kind: 'practice',
          id: 'p-two',
          concept: 'idea',
          cites: ['source'],
          exercise: {
            type: 'truefalse',
            statement: '答错时只告诉学习者“错了”就够了。',
            answer: false,
            why: '光判对错帮助很小。要说明错在哪里，学习者才知道该怎么改。',
          },
        },
        {
          kind: 'practice',
          id: 'p-three',
          concept: 'idea',
          cites: ['source'],
          exercise: {
            type: 'multi',
            prompt: '下面哪些内容应该写出处？',
            options: [
              { text: '一个具体的统计数字', correct: true, why: '数字需要能被核对，读者要知道它从哪里来。' },
              { text: '某个产品的官方限制', correct: true, why: '限制可能随时变化，要写清楚来源和查阅日期。' },
              { text: '你自己编的练习情境', why: '虚构情境不是事实，标明虚构就够了，不需要出处。' },
            ],
          },
        },
        {
          kind: 'practice',
          id: 'p-four',
          concept: 'idea',
          cites: ['source'],
          exercise: {
            type: 'order',
            prompt: '把写一步内容的顺序排好。',
            items: ['写练习题', '写讲解', '补出处', '跑检查'],
            why: '先定练习，才知道讲解要讲什么；出处跟着讲解走，检查放在最后。',
          },
        },
      ],
    },
  ],
}
