import { LandsatPdsProvider } from './LandsatPdsProvider'

const providerList = [new LandsatPdsProvider()]
export default providerList

export function getProviderByName (providerName) {
  for (var i = 0; i < providerList.length; i++) {
    if (providerList[i].name === providerName) {
      return providerList[i]
    }
  }
}
