import { lookupIpAddress } from './lookup-ip'

describe(lookupIpAddress.name, () => {
  it('should return an array of strings', async () => {
    const result = await lookupIpAddress()

    expect(result).toMatch(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)
  })
})
