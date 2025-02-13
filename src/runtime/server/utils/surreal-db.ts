import type { H3Event } from 'h3'

import type { RpcParams } from '../../types'
import { type ServerOverrides, useSurrealRPC } from './surreal-fetch'

export function useSurrealDB(event: H3Event, overrides?: ServerOverrides) {
  // query [ sql, vars ]
  async function query<T = any>(
    sql: RpcParams<T, 'query'>[0],
    vars?: RpcParams<T, 'query'>[1],
    ovr?: ServerOverrides,
  ) {
    return useSurrealRPC<T>(event, { method: 'query', params: [sql, vars] }, ovr || overrides)
  }

  return {
    query,
    sql: query,
  }
}
