import Script from 'next/script'

export default function NegocioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Script
        strategy="beforeInteractive"
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`}
      />
    </>
  )
}
