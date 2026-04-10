export const WaitFor = {
    REST_API_CALL_TIMEOUT: 600000,
    LOW_RETRY_COUNT: 3,
    MEDIUM_RETRY_COUNT: 5,
    HIGH_RETRY_COUNT: 10,
    RETRY_INTERVAL: 1000,
    FIND_ELEMENT_RETRY: 3,
    API_RETRY_COUNT: 3,
    API_TIMEOUT : 30000
} as const;

export type WaitForKeys = typeof WaitFor;
