/**
 * Returns the external IP address of the current machine.
 */
export const lookupIpAddress = async () => {
  const res = await fetch('https://api.ipify.org')
  return res.text()
}
