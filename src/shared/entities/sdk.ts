/**
 * core design of MeridianDB software development kit
 * it will be used by developers to interact with
 * the database over REST.
 * each request need to reauthenticate itself and request
 * refresh-token via the access token.
 * should be refactored out as stand-alone library  in the future
 */

/**
 * sdk config parameters
 */
interface MeridianDBClientConfig {
  // access token for authentication and authorization
  // it holds agentId and organizationId
  accessToken: string;
}

/**
 * this should replicate agent, behavior tracking, memory operation, authentication
 * services to allow
 */
interface MerdianDBClient {
  // agent
}
