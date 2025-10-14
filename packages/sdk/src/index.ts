import { ServiceResult } from "@meridiandb/shared/src/entities/base";
import {
  CreateMemoryEpisodeRequest,
  MemoryBehavioralUpdate,
  MemoryEpisode,
  MemoryRetrievalRequest,
} from "@meridiandb/shared/src/entities/memory";

import {
  AGENT_MEMORY_BEHAVIORAL,
  AGENT_SEARCH_MULTI,
  AGENT_SEARCH_SINGLE,
  AUTH_ENDPOINTS,
  ENDPOINTS,
} from "@meridiandb/shared/src/config/routes";

import { IMerdianDBClient, MeridianDBClientConfig } from "./types";

import jwt from "jsonwebtoken";

class MeridianDBClient implements IMerdianDBClient {
  constructor(private config: MeridianDBClientConfig) {}

  static #refreshToken: string;
  /**
   * Store a single episode in the meridian db.
   * @param data  memory eposide create payload
   */
  async storeMemory(
    data: CreateMemoryEpisodeRequest
  ): Promise<ServiceResult<MemoryEpisode>> {
    return this.postWithAccessToken(data, ENDPOINTS.memoriesAgent);
  }

  /**
   * Retreive memories for single ai agent
   * @param data
   */
  async retrieveMemoriesSingleAgent(
    data: MemoryRetrievalRequest
  ): Promise<ServiceResult<MemoryRetrievalRequest>> {
    return this.postWithAccessToken(
      data,
      ENDPOINTS.memoriesAgent + AGENT_SEARCH_SINGLE
    );
  }

  /**
   * Retreive memories for multi ai agent ( memory sharing )
   * @param data
   */
  async retrieveMemoriesMultieAgent(
    data: MemoryRetrievalRequest
  ): Promise<ServiceResult<MemoryRetrievalRequest>> {
    return this.postWithAccessToken(
      data,
      ENDPOINTS.memoriesAgent + AGENT_SEARCH_MULTI
    );
  }

  /**
   * Send behavioral update for multiple memories.
   * @param payload behavioral payloads memories uuids included in the agentic generation and status of sucess false or true
   */
  async recordFeedback(payload: MemoryBehavioralUpdate): Promise<boolean> {
    return this.postWithAccessToken(
      payload,
      ENDPOINTS.memoriesAgent + AGENT_MEMORY_BEHAVIORAL
    );
  }

  /**
   * Get refreshToken Private variable
   */

  static getRefreshToken() {
    return MeridianDBClient.#refreshToken;
  }

  /**
   * Set Refresh Token
   */
  static setRefreshToken(token: string) {
    MeridianDBClient.#refreshToken = token;
  }

  /**
   *
   * @param baseUrl meridiandb api base url
   * @param endpoint targeted endpoint
   * @param options options
   * @returns
   */
  private apiFetch = (
    baseUrl: string,
    endpoint: string,
    options?: RequestInit
  ) => {
    const url = `${baseUrl}${endpoint}`;
    return fetch(url, {
      ...options,
    });
  };

  /**
   * Post data with refresh token
   * @param payload
   * @returns
   */
  private async postWithAccessToken(payload: any, endpoint: string) {
    // check access or refresh the token
    const token = await this.checkAccess();

    // return the call
    return this.apiFetch(this.config.url, endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }

  /**
   * Get new refresh jwt token using agent access token
   */
  private async getToken(): Promise<string> {
    const res: any = await this.apiFetch(
      this.config.url,
      AUTH_ENDPOINTS.agent.access,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
        },
      }
    );

    if (!res.ok) return "";

    return res.json()?.token;
  }

  /**
   * Check if refresh token is expired
   * retrun true if it is expired, false if not
   * @param token refresh token
   */
  private isRefreshTokenExpired(token: string): boolean {
    const decoded: any = jwt.decode(token);
    if (!decoded && !decoded?.exp) return true;
    const expireTime = decoded.exp * 1000;
    const currentTime = Date.now();
    if (currentTime > expireTime) {
      return true;
    }
    return false;
  }

  /**
   * Checks if refresh token time expired , if so we will use
   * access token to request new token otherwise continue
   * with the same refreshToken
   * return true if access premited
   * return false
   * will throw error if access not granted using accessToken
   * @param token refresh token with livetime of 5m
   */
  private async checkAccess(): Promise<string> {
    const tokenExpired = this.isRefreshTokenExpired(
      MeridianDBClient.getRefreshToken()
    );
    if (!tokenExpired) return MeridianDBClient.getRefreshToken();

    // refresh token expired get new one
    const newRefreshToken = await this.getToken();
    MeridianDBClient.setRefreshToken(newRefreshToken);

    if (newRefreshToken === "")
      throw new Error("please check your access token!");

    return newRefreshToken;
  }
}

export default MeridianDBClient;
