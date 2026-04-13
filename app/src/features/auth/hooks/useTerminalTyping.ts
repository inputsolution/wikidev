import { useEffect, useState } from 'react'

export interface TerminalLine {
  kind: 'command' | 'hash' | 'diff' | 'meta' | 'plain'
  text: string
}

export interface TerminalStep {
  command: string
  output: TerminalLine[]
}

interface Timings {
  charDelayMs: number
  lineDelayMs: number
  afterCommandMs: number
  holdMs: number
  clearMs: number
}

interface RenderedLine {
  kind: TerminalLine['kind'] | 'command'
  text: string
}

const DEFAULT_TIMINGS: Timings = {
  charDelayMs: 55,
  lineDelayMs: 220,
  afterCommandMs: 450,
  holdMs: 2200,
  clearMs: 600,
}

export function useTerminalTyping(steps: TerminalStep[], timings: Partial<Timings> = {}) {
  const t: Timings = { ...DEFAULT_TIMINGS, ...timings }
  const [stepIndex, setStepIndex] = useState(0)
  const [lines, setLines] = useState<RenderedLine[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [phase, setPhase] = useState<'typing' | 'output' | 'hold' | 'clear'>('typing')

  useEffect(() => {
    if (steps.length === 0) return
    const step = steps[stepIndex % steps.length]
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const after = (ms: number, fn: () => void) => {
      const id = setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
      timeouts.push(id)
    }

    const typeCommand = (index: number) => {
      if (cancelled) return
      if (index > step.command.length) {
        after(t.afterCommandMs, () => {
          setLines([{ kind: 'command', text: step.command }])
          setCurrentCommand('')
          setPhase('output')
          printOutput(0)
        })
        return
      }
      setCurrentCommand(step.command.slice(0, index))
      after(t.charDelayMs, () => typeCommand(index + 1))
    }

    const printOutput = (index: number) => {
      if (cancelled) return
      if (index >= step.output.length) {
        setPhase('hold')
        after(t.holdMs, () => {
          setPhase('clear')
          after(t.clearMs, () => {
            setLines([])
            setCurrentCommand('')
            setPhase('typing')
            setStepIndex((i) => (i + 1) % steps.length)
          })
        })
        return
      }
      setLines((prev) => [...prev, step.output[index]])
      after(t.lineDelayMs, () => printOutput(index + 1))
    }

    setLines([])
    setCurrentCommand('')
    setPhase('typing')
    typeCommand(0)

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [stepIndex, steps, t.afterCommandMs, t.charDelayMs, t.clearMs, t.holdMs, t.lineDelayMs])

  return { lines, currentCommand, phase }
}
