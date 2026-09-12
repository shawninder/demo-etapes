import broadback from './broadback'

export type RiverFeature = {
  km: string
  label: string
  text: string
}

const riverFeatures: { [key: string]: RiverFeature[] } = {
  broadback
}

export default riverFeatures
