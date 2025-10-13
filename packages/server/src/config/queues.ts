import { getSimpleQueueClient } from "@meridiandb/shared/src/queue/client/SimpleQueueClient";
import { getQueuesEnvVariables } from "./context";

/**
 * Temporal Queue Client used in publishing temporal
 * feature write on read to update access freqency
 */
export const temporalQueueClient = () =>
  getSimpleQueueClient({
    baseUrl: getQueuesEnvVariables().temporalQueueURL,
    apiKey: getQueuesEnvVariables().temporalQueueApiKey,
    maxPayloadSize: 1000,
  });
