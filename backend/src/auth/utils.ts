import { decode } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'
import { createLogger } from '../utils/logger'

const logger = createLogger('auth')

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  logger.info('parsing userId from jwttoken')

  const decodedJwt = decode(jwtToken) as JwtPayload

  logger.info('parsed userId')
  return decodedJwt.sub
}
