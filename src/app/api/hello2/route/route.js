/*
Test route
*/

import {OPTIONS as _OPTIONS} from '../../../../lib/api'

export async function OPTIONS(req, res) {
    return _OPTIONS(req, res)
}

export async function GET(req, res) {
  return Response.json({ text: 'Hello from Next.js API!' })
}
