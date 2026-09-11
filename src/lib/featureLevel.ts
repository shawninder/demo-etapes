export type FeatureLevel =
  | 'helpful'
  | 'neutral'
  | 'fun'
  | 'active'
  | 'engaging'
  | 'demanding'
  | 'extreme'
  | 'impassable'

const featureLevelClassName: Record<FeatureLevel, string> = {
  helpful: 'bg-level-helpful-bg border-level-helpful-border text-level-helpful-text',
  neutral: 'bg-level-neutral-bg border-level-neutral-border text-level-neutral-text',
  fun: 'bg-level-fun-bg border-level-fun-border text-level-fun-text',
  active: 'bg-level-active-bg border-level-active-border text-level-active-text',
  engaging: 'bg-level-engaging-bg border-level-engaging-border text-level-engaging-text',
  demanding: 'bg-level-demanding-bg border-level-demanding-border text-level-demanding-text',
  extreme: 'bg-level-extreme-bg border-level-extreme-border text-level-extreme-text',
  impassable: 'bg-level-impassable-bg border-level-impassable-border text-level-impassable-text',
}

const rapidLevels: (FeatureLevel | undefined)[] = [undefined, 'fun', 'active', 'engaging', 'demanding', 'extreme', 'impassable']

function ledgeLevel (classNum: number): FeatureLevel {
  if (classNum <= 2) return 'engaging'
  if (classNum <= 5) return 'demanding'
  return 'extreme'
}

const unratedTypeLevels: Record<string, FeatureLevel> = {
  EV: 'helpful',
  K: 'impassable',
  C: 'impassable',
}

const labelPattern = /^([A-Z]+)(\d+)?(?:-(\d+))?/

export function getFeatureLevel (label: string): FeatureLevel | null {
  const match = labelPattern.exec(label.trim())
  if (!match) return null

  const [, type, low, high] = match
  const classNum = high ? parseInt(high, 10) : low ? parseInt(low, 10) : undefined

  if (classNum === undefined) {
    return unratedTypeLevels[type] ?? null
  }

  if (type === 'R') return rapidLevels[classNum] ?? 'impassable'
  if (type === 'S') return ledgeLevel(classNum)
  if (type === 'C') return classNum >= 1 ? 'extreme' : 'impassable'

  return null
}

export function getFeatureLevelClassName (label: string): string {
  const level = getFeatureLevel(label)
  console.log({ label, level, className: level ? featureLevelClassName[level] : '' })
  return level ? featureLevelClassName[level] : ''
}
