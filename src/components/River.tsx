'use client'

import { useState } from "react"
import type { RiverFeature } from "@/app/[slug]/features"

export type RiverProps = {
  features: RiverFeature[]
}

export default function River ({ features }: RiverProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

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

  return (
    <table className='w-full'>
      <thead>
        <tr>
          <th></th>
          <th>km</th>
          <th>label</th>
          <th>text</th>
          <th>distance</th>
          <th>features</th>
        </tr>
      </thead>
      <tbody>{features.map(({ id, km, label, text }) => {
        if (label.indexOf('🏕') === -1 && label.indexOf('put-in') === -1) {
          return null
        }
        return (
          <tr key={id}>
            <td>
              <input type='checkbox' onChange={onChange} data-km={km} />
            </td>
            <td>{km}</td>
            <td>{label}</td>
            <td>{text}</td>
            <td>{checked[km] ? distanceFromLastChecked(parseFloat(km), sortedChecked) : null}</td>
            <td>{checked[km] ? featuresEncountered(parseFloat(km), sortedChecked, features) : null}</td>
          </tr>
        )
      })}</tbody>
    </table>
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
      && feature.label.indexOf('put-in') === -1) {
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