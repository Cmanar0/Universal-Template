// utils/jwtUtils.ts

// Function to decode JWT
export function getJwtClaims(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = atob(base64)
    const decoded = JSON.parse(payload)
    return decoded
  } catch (e) {
    console.error('Error decoding JWT:', e)
    return {}
  }
}
