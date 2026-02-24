// src/utils/logger.js
export const logRequest = (label, data) => {
  if (import.meta.env.DEV) {
    console.log(`🔵 [${label}] Sending:`, data);
  }
};

export const logResponse = (label, res) => {
  if (import.meta.env.DEV) {
    console.log(`🟢 [${label}] Response:`, res.data);
  }
};

export const logError = (label, err) => {
  if (import.meta.env.DEV) {
    if (err.response) {
      console.error(`🔴 [${label}] Backend error:`, err.response.data);
    } else {
      console.error(`❌ [${label}] Request failed:`, err.message);
    }
  } else {
    // In production, you would report this to Sentry / LogRocket
    // console.error(`[Prod Error] ${label}:`, err.message);
  }
};

export const logEvent = (event, data = {}) => {
  if (import.meta.env.PROD) {
    // Send to analytics / Sentry
  } else {
    console.info(`[EVENT] ${event}`, data);
  }
};
