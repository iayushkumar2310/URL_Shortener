import { resolve } from 'node:path'
import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { Prisma, PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { generateShortCode } from './shortCode.js'

dotenv.config({ path: resolve(process.cwd(), '../.env') })
const prisma = new PrismaClient()
const app = express()
const port = Number(process.env.PORT ?? 3000)
const publicBaseUrl = (process.env.PUBLIC_SHORT_URL_BASE ?? `http://localhost:${port}`).replace(/\/$/, '')
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: frontendOrigin }))
app.use(express.json({ limit: '8kb' }))

const shortenRequest = z.object({
  url: z.string().trim().min(1).max(2048).url().refine((value) => {
    const protocol = new URL(value).protocol
    return protocol === 'http:' || protocol === 'https:'
  }, 'Only HTTP and HTTPS links are supported.'),
})

app.get('/health', (_request, response) => response.json({ status: 'ok' }))

app.post('/api/shorten', async (request, response) => {
  const parsed = shortenRequest.safeParse(request.body)
  if (!parsed.success) {
    return response.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Enter a valid HTTP or HTTPS URL.' })
  }

  try {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = generateShortCode()
      try {
        await prisma.url.create({ data: { code, originalUrl: parsed.data.url } })
        return response.status(201).json({ code, shortUrl: `${publicBaseUrl}/${code}` })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') continue
        throw error
      }
    }
    return response.status(503).json({ error: 'Could not create a unique link. Please try again.' })
  } catch (error) {
    console.error('Failed to save short URL:', error)
    return response.status(503).json({ error: 'The link service is temporarily unavailable.' })
  }
})

app.get('/:code', async (request, response) => {
  const code = request.params.code
  try {
    const savedUrl = await prisma.url.findUnique({ where: { code } })
    if (!savedUrl || (savedUrl.expiresAt && savedUrl.expiresAt <= new Date())) {
      return response.status(404).type('html').send(notFoundPage)
    }
    return response.redirect(302, savedUrl.originalUrl)
  } catch (error) {
    console.error('Failed to look up short URL:', error)
    return response.status(503).send('Link service temporarily unavailable.')
  }
})

app.use((_request, response) => response.status(404).type('html').send(notFoundPage))

const notFoundPage = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Link not found · Snip</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fbfcf8;color:#203b31;font:16px system-ui,sans-serif}.card{text-align:center;max-width:380px;padding:44px 32px;border:1px solid #e3e8e3;border-radius:18px;background:white;box-shadow:0 18px 48px #203b3110}.mark{margin:auto auto 20px;width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:#dff273;font-size:26px;font-weight:800}.card h1{font:40px Georgia,serif;margin:0 0 12px}.card p{color:#738078;line-height:1.6;margin:0 0 24px}.card a{display:inline-block;padding:12px 18px;border-radius:9px;background:#254a3c;color:white;text-decoration:none;font-weight:600}</style><div class="card"><div class="mark">s.</div><h1>That link wandered off.</h1><p>This short link doesn’t exist or has expired. No worries — you can make a fresh one.</p><a href="${frontendOrigin}">Make a new link</a></div></html>`

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Snip API listening at ${publicBaseUrl}`))
}

export { app, prisma }
