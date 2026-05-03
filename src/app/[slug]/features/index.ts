import broadback from './broadback'

export type RiverFeature = {
  id: string
  km: string
  label: string
  text: string
}

const riverFeatures: { [key: string]: RiverFeature[] } = {
  broadback
}

export default riverFeatures
