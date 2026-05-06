'use client'

import { useEffect, useState } from "react"
import type { RiverFeature } from "@/app/[slug]/features"

export type RiverProps = {
  features: RiverFeature[]
}

export default function River ({ features = [] }: RiverProps) {
  const [hydrated, setHydrated] = useState(false)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const stored = localStorage.getItem('checked')
    if (stored) {
      setChecked(JSON.parse(stored))
    }
    setHydrated(true)
  }, [])
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('checked', JSON.stringify(checked))
  }, [checked, hydrated])

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const km = event.target.dataset.km
    if (km) {
      setChecked((prev) => ({
        ...prev,
        [km]: event.target.checked
      }))
    }
  }

  const sortedChecked = Object.entries(checked)
    .filter(([_, isChecked]) => isChecked)
    .map(([km]) => parseFloat(km))
    .sort((a, b) => b - a)

  let dayCounter = 1
  return (
    <div className='w-full pl-5 feature-list'>
      {features.map(({ id, km, label, text }) => {
        if (label === '') {
          return null
        }
        const kmsTravelled = checked[km] ? distanceFromLastChecked(parseFloat(km), sortedChecked) : null
        const daySummary = checked[km] ? featuresEncountered(parseFloat(km), sortedChecked, features) : null
        return (
          <div key={id}>
            {(label.indexOf('🏕') !== -1 || label.indexOf('🚙') !== -1) && (kmsTravelled || daySummary) ? (
              <div className='text-right'>
                <span>Jour {dayCounter++}: </span>
                {kmsTravelled}{" – "}{daySummary}
              </div>
            ) : null}
            <div title={text}>
              <span className='text-xs text-muted w-16 inline-block font-mono'>km {parseFloat(km).toFixed(1)}</span>
              {label.indexOf('🏕') !== -1 || label.indexOf('🚙') !== -1
                ? (
                  <input type='checkbox' checked={checked[km] || false} onChange={onChange} data-km={km} />
                )
                : null
              }
              {label[0] === 'R' || label[0] === 'C' || label[0] === 'L' || label[0] === 'R' || label[0] === 'E'
                ? '🌊'
                : null
              } {label}
              {" – "}<span className='italic text-muted'>{text}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function distanceFromLastChecked(km: number, sortedChecked: number[]) {
  if (sortedChecked.length === 0) {
    return null
  }

  let lastKm = Infinity
  for (const marker of sortedChecked) {
    if (marker < km) {
      break
    }
    if (marker !== km) {
      if (marker < lastKm) {
        lastKm = marker
      }
    }
  }
  const distance = lastKm - km

  return lastKm === Infinity ? null : `~${Math.round(distance)} km`
}

function featuresEncountered(km: number, sortedChecked: number[], features: RiverFeature[]) {
  if (sortedChecked.length === 0) {
    return null
  }

  let lastKm = Infinity
  for (const marker of sortedChecked) {
    if (marker < km) {
      break
    }
    if (marker !== km) {
      if (marker < lastKm) {
        lastKm = marker
      }
    }
  }

  const featuresEncountered = features.reduce<Record<string, number>>((acc, feature) => {
    const featureKm = parseFloat(feature.km)
    if (featureKm > km
      && featureKm <= lastKm
      && feature.label !== ''
      && feature.label.indexOf('🏕') === -1
      && feature.label.indexOf('🚙') === -1) {
        if (!acc[feature.label]) {
          acc[feature.label] = 0
        }
        acc[feature.label]++
      }
    return acc
  }, {})

  return Object.entries(featuresEncountered)
    .map(([label, count]) => `${count} ${label}`)
    .join(', ')
}