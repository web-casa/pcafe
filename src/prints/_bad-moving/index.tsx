// QA fixture, broken on purpose: a number that keeps changing whatever the motion setting. Expected: "still changing".
import { useEffect, useState } from 'react'
import { definePrint, Stack, Text, Title } from '../../print'

function Moving() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + 1), 100)
    return () => clearInterval(t)
  }, [])
  return <Text>{n}</Text>
}

export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => <Stack><Title lines={['标题']} /><Moving /></Stack>,
})
