'use client'

import { Fragment, useEffect, useState } from "react"
import type { RiverFeature } from "@/app/[slug]/features"
import { Item, ItemGroup, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { compareFeatureLevel, getDistanceLevelClassName, getFeatureLevelClassName } from "@/lib/featureLevel"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

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
    <ItemGroup className='w-full max-w-2xl feature-list gap-0 self-center'>
      <Day dayCounter={dayCounter++} />
      {features.map(({ id, km, label, text }) => {
        if (label === '') {
          return null
        }
        const kmsTravelled = checked[km] ? distanceFromLastChecked(parseFloat(km), sortedChecked) : null
        const kmsTravelledLevelClassName = kmsTravelled !== null ? getDistanceLevelClassName(kmsTravelled) : ''
        const daySummary = checked[km] ? countFeaturesEncountered(parseFloat(km), sortedChecked, features) : null
        const isCampable = label.indexOf('🏕') !== -1 || label.indexOf('🚙') !== -1
        return (
          <Fragment key={id}>
            <Item variant='outline' title={text} className='py-0.5 rounded-none hover:bg-muted bg-accent/50'>
              <ItemMedia variant='icon' className='text-xs text-muted-foreground w-16 inline-block font-mono'>km {parseFloat(km).toFixed(1)}</ItemMedia>
              <ItemContent className='flex flex-row items-center gap-2'>
                <ItemTitle className='w-14'>
                  {label[0] === 'R' || label[0] === 'C' || label[0] === 'L' || label[0] === 'S' || label[0] === 'E'
                    ? '🌊'
                    : null
                  }{" "}{label}
                </ItemTitle>
                <ItemDescription className='text-foreground'>{text}</ItemDescription>
              </ItemContent>
              {isCampable
                ? (
                  <ItemActions>
                    <label className='w-16 text-right'>
                      <Input type='checkbox' checked={checked[km] || false} onChange={onChange} data-km={km} className='size-6' />
                    </label>
                  </ItemActions>
                )
                : null
              }
            </Item>
            {isCampable && (kmsTravelled || daySummary) ? (
              <Item className=''>
                <ItemContent className='items-center'>
                  {kmsTravelled !== null && <ItemTitle className='text-center'>totalisant <span className={cn('text-lg', kmsTravelledLevelClassName)}>{kmsTravelled} km</span> avec </ItemTitle>}
                  <ItemGroup className='flex-row flex-wrap justify-center'>
                    {daySummary && Object.entries(daySummary)
                      .sort(([a], [b]) => compareFeatureLevel(a, b))
                      .map(([label, count]) => (
                      <Item key={label} className='flex flex-row items-center gap-2 w-fit'>
                        <ItemTitle><span className='font-bold'>{count}</span>{" "}⨉ <span className={cn('text-lg border border-accent inline-block p-2 rounded', getFeatureLevelClassName(label))}>{label}</span></ItemTitle>
                      </Item>
                    ))}
                  </ItemGroup>
                </ItemContent>
              </Item>
            ) : null}
            {isCampable && (kmsTravelled || daySummary) ? (
              <Day dayCounter={dayCounter++} />
            ) : null}
          </Fragment>
        )
      })}
    </ItemGroup>
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

  return lastKm === Infinity ? null : Math.round(10 * distance) / 10
}

function countFeaturesEncountered(km: number, sortedChecked: number[], features: RiverFeature[]) {
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

  return features.reduce<Record<string, number>>((acc, feature) => {
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
}

function Day ({ dayCounter }: { dayCounter: number }) {
  return (
    <Item className='font-bold justify-center text-lg'>Jour {dayCounter}</Item>
  )
}