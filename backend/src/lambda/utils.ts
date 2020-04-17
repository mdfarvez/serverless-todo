import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import { createLogger } from "../utils/logger";

const logger = createLogger('auth')

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  logger.info('Getting userId from event')

  return parseUserId(jwtToken)
}

/** 
 * Generate a Auth0 certificate
 * @param cert base64 code by a get req using auth0 json endpoint
 * 
 * @returns a Auth0 RS256 certificate
 */
export function certToPEM(cert: any) {
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`

  logger.info('Created Auth0 Certificate from base64 public key')

  return cert
}