import { API_BASE_URL, getApiBaseUrl } from '@/shared/config/env'

describe('env api base url resolution', () => {
  it('uses same-origin proxy for netlify preview hosts', () => {
    expect(getApiBaseUrl('69bc2637b2706a0007019dc8--perkscrowd0618.netlify.app')).toBe('')
  })

  it('uses same-origin proxy for cloudflare workers preview hosts', () => {
    expect(getApiBaseUrl('perkscrowd-ui.some-account.workers.dev')).toBe('')
  })

  it('uses same-origin proxy for cloudflare pages preview hosts', () => {
    expect(getApiBaseUrl('abc123def.perkscrowd-ui.pages.dev')).toBe('')
  })

  it('keeps configured API base for production hosts', () => {
    expect(getApiBaseUrl('perkscrowd.com')).toBe(API_BASE_URL)
  })
})

