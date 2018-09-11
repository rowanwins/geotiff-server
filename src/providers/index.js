import { LandsatPdsProvider } from './LandsatPdsProvider'
import { DeaProvider } from './DeaProvider'

const providerList = [new LandsatPdsProvider(), new DeaProvider()]
export default providerList

export function getProviderByName (providerName) {
  for (var i = 0; i < providerList.length; i++) {
    if (providerList[i].name === providerName) {
      return providerList[i]
    }
  }
}
