import { ErrorDetails } from '../../types/observability';

export const captureErrorContext = (error: unknown): ErrorDetails => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : undefined, // Keep first 5 lines for safety
    };
  }

  if (typeof error === 'string') {
    return {
      name: 'StringException',
      message: error,
    };
  }

  try {
    return {
      name: 'ObjectException',
      message: JSON.stringify(error),
    };
  } catch (e) {
    return {
      name: 'UnknownException',
      message: 'Failed to inspect exception details',
    };
  }
};
export default captureErrorContext;
