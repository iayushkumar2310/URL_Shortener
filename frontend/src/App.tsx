import { useState, type FormEvent } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function shortenUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setShortUrl('')
    setLoading(true)

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data: { shortUrl?: string; error?: string } = await response.json()
      if (!response.ok || !data.shortUrl) {
        throw new Error(data.error ?? 'Unable to shorten this URL. Try again.')
      }
      setShortUrl(data.shortUrl)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shortUrl)
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Snip home"><span className="brand-mark">s</span> snip<span className="brand-dot">.</span></a>
        <span className="topbar-note"><span className="status-dot" /> A little link magic</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span>✳</span> YOUR LINK, JUST A LITTLE LIGHTER</p>
          <h1 id="hero-title">Good links<br />travel <em>further.</em></h1>
          <p className="intro">Long URL? Let’s make it a little easier to share. Paste it below and get a tidy link in seconds.</p>
          <form className="shorten-form" onSubmit={shortenUrl}>
            <label htmlFor="url-input">Paste your long URL</label>
            <div className="input-row">
              <span className="link-icon" aria-hidden="true">↗</span>
              <input
                id="url-input"
                type="url"
                inputMode="url"
                placeholder="https://example.com/a/very/long/link"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                required
                aria-describedby={error ? 'form-error' : undefined}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Making link…' : 'Make it short'} <span aria-hidden="true">↗</span>
              </button>
            </div>
            {error && <p className="form-message error" id="form-error" role="alert">{error}</p>}
          </form>

          {shortUrl && (
            <div className="result-card" aria-live="polite">
              <div><span className="result-label">YOUR SHORT LINK</span><a href={shortUrl}>{shortUrl}</a></div>
              <button className="copy-button" type="button" onClick={copyLink}>Copy link</button>
            </div>
          )}
          <p className="fine-print"><span aria-hidden="true">⌁</span> Free to use. No account needed.</p>
        </div>

        <aside className="visual" aria-label="A long link transformed into a short link">
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="spark spark-one">✳</div><div className="spark spark-two">✦</div><div className="spark spark-three">·</div>
          <div className="link-card long-card"><span className="card-icon">↗</span><span><small>THE ORIGINAL</small><strong>way.too.many.characters</strong></span><span className="card-menu">···</span></div>
          <div className="connector"><span>↓</span><small>SNIP!</small></div>
          <div className="link-card short-card"><span className="short-symbol">s.</span><span><small>READY TO SHARE</small><strong>snip.link/bright</strong></span><span className="copy-symbol">▢</span></div>
          <div className="sticker">LESS LINK.<br /><em>MORE CLICK.</em></div>
        </aside>
      </section>

      <section className="steps" aria-label="How it works">
        <div className="steps-heading"><span className="eyebrow">THREE LITTLE STEPS</span><span className="steps-line" /></div>
        <div className="step-grid">
          <article className="step"><span className="step-number">01</span><div><h2>Drop your link</h2><p>Any long URL will do. Paste it right up top.</p></div><span className="step-icon">↘</span></article>
          <article className="step"><span className="step-number">02</span><div><h2>Give it a snip</h2><p>We’ll turn that mouthful into something neat.</p></div><span className="step-icon">✳</span></article>
          <article className="step"><span className="step-number">03</span><div><h2>Send it everywhere</h2><p>Copy your new link and pass it along.</p></div><span className="step-icon">↗</span></article>
        </div>
      </section>

      <footer className="footer"><a className="brand footer-brand" href="/">snip<span className="brand-dot">.</span></a><span>Small links. Big possibilities.</span><span>MADE FOR THE INTERNET <span className="footer-star">✳</span></span></footer>
    </main>
  )
}

export default App
