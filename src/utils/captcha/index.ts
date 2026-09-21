declare const grecaptcha: {
  ready: (cb: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
}

async function getCaptcha(siteKey: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (typeof grecaptcha === 'undefined') {
      return reject(new Error("Google reCAPTCHA script hasn't loaded."))
    }
    grecaptcha.ready(async () => {
      try {
        const token = await grecaptcha.execute(siteKey, { action: 'auth' })
        resolve(token)
      } catch (error) {
        reject(error)
      }
    })
  })
}

async function verifyCaptcha(token: string) {
  const secret = process.env.CAPTCHA_SECRET_KET
  if (!secret) throw new Error('reCAPTCHA secret key is missing.')

  const url = new URL('https://www.google.com/recaptcha/api/siteverify')
  url.searchParams.append('secret', secret)
  url.searchParams.append('response', token)

  const response = await fetch(url, { method: 'POST' })
  if (!response.ok) return null

  const data = await response.json()
  return data as {
    success: boolean
    score: number
    action: string
    challenge_ts: string
    hostname: string
    'error-codes'?: string[]
  }
}

export { getCaptcha, verifyCaptcha }
