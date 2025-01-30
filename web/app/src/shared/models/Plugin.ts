export interface PluginOption {
  id: string,
  name: string,
  url: string,
  key: string,
  items: {
    id: string,
    key: string,
    type: string,
    color?: string,
  }[]
}