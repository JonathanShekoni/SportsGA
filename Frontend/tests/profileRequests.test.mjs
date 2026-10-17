import test from 'node:test'
import assert from 'node:assert/strict'
import { startProfileRequests } from '../src/profileRequests.js'

const tick = () => new Promise(resolve => setImmediate(resolve))
const reply = data => ({ ok: true, json: async () => data })
const callbacks = () => {
  const results = { profile: [], career: [], error: [], careerError: [] }
  return { results, handlers: Object.fromEntries(Object.keys(results).map(key => [key, value => results[key].push(value)])) }
}

test('old responses cannot overwrite a newer lookup even when fetch ignores abort', async () => {
  const pending = []
  const fetchImpl = (url, options) => new Promise(resolve => pending.push({ url, options, resolve }))
  const old = callbacks()
  const cancelOld = startProfileRequests('LeBron James', old.handlers, fetchImpl)
  cancelOld()
  assert.equal(pending[0].options.signal.aborted, true)
  const current = callbacks()
  const cancelCurrent = startProfileRequests('Stephen Curry', current.handlers, fetchImpl)
  pending[2].resolve(reply({ points: 26.5 }))
  pending[3].resolve(reply([{ PTS: 26.5 }]))
  await tick()
  pending[0].resolve(reply({ points: 20.9 }))
  pending[1].resolve(reply([{ PTS: 20.9 }]))
  await tick()
  assert.deepEqual(old.results.profile, [])
  assert.deepEqual(old.results.career, [])
  assert.deepEqual(current.results.profile, [{ points: 26.5 }])
  cancelCurrent()
})

test('career failure does not suppress successful season stats', async () => {
  const result = callbacks()
  const cancel = startProfileRequests('Shai Gilgeous-Alexander', result.handlers, async url => {
    if (url.includes('/career')) return { ok: false }
    return reply({ points: 31.1 })
  })
  await tick()
  assert.deepEqual(result.results.profile, [{ points: 31.1 }])
  assert.equal(result.results.careerError.length, 1)
  assert.equal(result.results.error.length, 0)
  cancel()
})

test('invalid JSON produces an error callback instead of an endless spinner', async () => {
  const result = callbacks()
  const cancel = startProfileRequests('A & B', result.handlers, async url => {
    assert.ok(url.includes('name=A+%26+B'))
    return { ok: true, json: async () => { throw new SyntaxError('Not JSON') } }
  })
  await tick()
  assert.equal(result.results.error.length, 1)
  assert.equal(result.results.careerError.length, 1)
  cancel()
})
