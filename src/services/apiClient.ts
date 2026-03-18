export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });

    const payload = await parseBody(response);

    if (!response.ok) {
      const message =
        typeof payload === 'object' && payload !== null && 'message' in payload
          ? String((payload as { message?: string }).message ?? 'Request failed')
          : 'Request failed';
      throw new ApiError(message, response.status);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Network request failed. Please try again.', 0);
  }
}
