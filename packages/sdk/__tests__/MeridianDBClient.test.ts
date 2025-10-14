import MeridianDBClient from "../src/index";
import {
  CreateMemoryEpisodeRequest,
  MemoryBehavioralUpdate,
  MemoryRetrievalRequest,
} from "@meridiandb/shared/src/entities/memory";
import {
  AGENT_MEMORY_BEHAVIORAL,
  AGENT_SEARCH_MULTI,
  AGENT_SEARCH_SINGLE,
  AUTH_ENDPOINTS,
  ENDPOINTS,
} from "@meridiandb/shared/src/config/routes";

// Mock jwt
jest.mock("jsonwebtoken", () => ({
  decode: jest.fn(),
}));

import jwt from "jsonwebtoken";
import { AccessLevel } from "@meridiandb/shared/src/entities/enums";
import { MemoryStage } from "@meridiandb/shared/src/entities/enums";

// Mock fetch globally
global.fetch = jest.fn();

describe("MeridianDBClient", () => {
  let client: MeridianDBClient;
  const mockConfig = {
    url: "https://api.meridiandb.com",
    accessToken: "mock-access-token",
  };

  const mockRefreshToken = "mock-refresh-token";
  const mockMemoryEpisode = {
    id: "123",
    agentId: "agent-1",
    organizationId: "org-1",
    content: "test memory",
    recencyScore: 0.8,
    accessFrequency: 0.5,
    isFactual: false,
    isIrrelevant: false,
    context: "test context",
    successRate: 0.9,
    positive: 5,
    negative: 1,
    accessLevel: AccessLevel.PRIVATE,
    stage: MemoryStage.EPISODIC,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    client = new MeridianDBClient(mockConfig);
    MeridianDBClient.setRefreshToken(mockRefreshToken);

    // Mock jwt.decode to return non-expired token by default
    (jwt.decode as jest.Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
    });

    console.log("refresh token", MeridianDBClient.getRefreshToken());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("storeMemory", () => {
    it("should store a memory episode successfully", async () => {
      const mockRequest: CreateMemoryEpisodeRequest = {
        agentId: "agent-1",
        organizationId: "org-1",
        content: "test content",
        recencyScore: 0.8,
        accessFrequency: 0.5,
        isFactual: false,
        isIrrelevant: false,
        context: "test context",
        successRate: 0.9,
        positive: 5,
        negative: 1,
        accessLevel: AccessLevel.PRIVATE,
        stage: MemoryStage.EPISODIC,
      };

      const mockResponse = {
        success: true,
        data: mockMemoryEpisode,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await client.storeMemory(mockRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockConfig.url}${ENDPOINTS.memoriesAgent}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockRefreshToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockRequest),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("retrieveMemoriesSingleAgent", () => {
    it("should retrieve memories for single agent", async () => {
      const mockRequest: MemoryRetrievalRequest = {
        query: "search query",
      };

      const mockResponse = {
        success: true,
        data: [mockMemoryEpisode],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await client.retrieveMemoriesSingleAgent(mockRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockConfig.url}${ENDPOINTS.memoriesAgent}${AGENT_SEARCH_SINGLE}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockRefreshToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockRequest),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("retrieveMemoriesMultiAgent", () => {
    it("should retrieve memories for multiple agents", async () => {
      const mockRequest: MemoryRetrievalRequest = {
        query: "search query",
      };

      const mockResponse = {
        success: true,
        data: [mockMemoryEpisode],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await client.retrieveMemoriesMultieAgent(mockRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockConfig.url}${ENDPOINTS.memoriesAgent}${AGENT_SEARCH_MULTI}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockRefreshToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockRequest),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("recordFeedback", () => {
    it("should record behavioral feedback successfully", async () => {
      const mockPayload: MemoryBehavioralUpdate = {
        success: true,
        memories: ["mem-1", "mem-2"],
      };

      const mockResponse = {
        success: true,
        data: { updated: true },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await client.recordFeedback(mockPayload);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockConfig.url}${ENDPOINTS.memoriesAgent}${AGENT_MEMORY_BEHAVIORAL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockRefreshToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockPayload),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Token Management", () => {
    it("should get and set refresh token", () => {
      const newToken = "new-refresh-token";
      MeridianDBClient.setRefreshToken(newToken);
      expect(MeridianDBClient.getRefreshToken()).toBe(newToken);
    });

    it("should use existing token if not expired", async () => {
      const mockRequest: CreateMemoryEpisodeRequest = {
        agentId: "agent-1",
        organizationId: "org-1",
        content: "test",
        recencyScore: 0.8,
        accessFrequency: 0.5,
        isFactual: false,
        isIrrelevant: false,
        context: "test context",
        successRate: 0.9,
        positive: 5,
        negative: 1,
        accessLevel: AccessLevel.PRIVATE,
        stage: MemoryStage.CONSOLIDATED,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ success: true }),
      });

      await client.storeMemory(mockRequest);

      // Should only call once for the actual request, not for token refresh
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should refresh token if expired", async () => {
      // Mock expired token
      (jwt.decode as jest.Mock).mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
      });

      const newToken = "new-refresh-token";

      // Mock token refresh response
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ token: newToken }),
        })
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue({ success: true }),
        });

      const mockRequest: CreateMemoryEpisodeRequest = {
        agentId: "agent-1",
        organizationId: "org-1",
        content: "test",
        recencyScore: 0.8,
        accessFrequency: 0.5,
        isFactual: false,
        isIrrelevant: false,
        context: "test context",
        successRate: 0.9,
        positive: 5,
        negative: 1,
        accessLevel: AccessLevel.PRIVATE,
        stage: MemoryStage.CONSOLIDATED,
      };

      await client.storeMemory(mockRequest);

      // Should call twice: once for refresh, once for actual request
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        `${mockConfig.url}${AUTH_ENDPOINTS.agent.access}`,
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockConfig.accessToken}`,
          },
        })
      );
    });

    it("should throw error if token refresh fails", async () => {
      // Mock expired token
      (jwt.decode as jest.Mock).mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 3600,
      });

      // Mock failed token refresh
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const mockRequest: CreateMemoryEpisodeRequest = {
        agentId: "agent-1",
        organizationId: "org-1",
        content: "test",
        recencyScore: 0.8,
        accessFrequency: 0.5,
        isFactual: false,
        isIrrelevant: false,
        context: "test context",
        successRate: 0.9,
        positive: 5,
        negative: 1,
        accessLevel: AccessLevel.PRIVATE,
        stage: MemoryStage.CONSOLIDATED,
      };

      await expect(client.storeMemory(mockRequest)).rejects.toThrow(
        "please check your access token!"
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const mockRequest: CreateMemoryEpisodeRequest = {
        agentId: "agent-1",
        organizationId: "org-1",
        content: "test",
        recencyScore: 0.8,
        accessFrequency: 0.5,
        isFactual: false,
        isIrrelevant: false,
        context: "test context",
        successRate: 0.9,
        positive: 5,
        negative: 1,
        accessLevel: AccessLevel.PRIVATE,
        stage: MemoryStage.CONSOLIDATED,
      };

      await expect(client.storeMemory(mockRequest)).rejects.toThrow(
        "Network error"
      );
    });
  });
});
