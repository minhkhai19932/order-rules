/**
 * HTTP error response data.
 */
export interface HttpErrorData {
  readonly message: string;
  readonly status: number;
  readonly statusText: string;
  readonly data?: unknown;
}

/**
 * Custom error class for HTTP errors.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data?: unknown;

  constructor(
    message: string,
    status: number,
    statusText: string,
    data?: unknown
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/**
 * Request options extending Fetch API RequestInit.
 */
export interface RequestOptions extends Omit<RequestInit, "body"> {
  readonly body?: unknown;
}

/**
 * Base URL for backendA API.
 */
const BASE_URL = import.meta.env.VITE_BACKEND_A_BASE_URL as string;

if (!BASE_URL) {
  console.warn("VITE_BACKEND_A_BASE_URL is not set");
}

/**
 * Performs an HTTP request with JSON handling and typed error throwing.
 *
 * @param endpoint - API endpoint path (will be appended to base URL)
 * @param options - Request options (method, body, headers, etc.)
 * @returns Promise resolving to typed response data
 * @throws HttpError when response status is not 2xx
 */
export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...fetchOptions } = options;

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const url = `${BASE_URL}${normalizedEndpoint}`;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  const requestBody = body !== undefined ? JSON.stringify(body) : undefined;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      body: requestBody,
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json") ?? false;

    let data: unknown;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new HttpError(
        `Request failed: ${response.statusText}`,
        response.status,
        response.statusText,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new HttpError(error.message, 0, "Network Error", undefined);
    }
    throw new HttpError(
      "Unknown error occurred",
      0,
      "Unknown Error",
      undefined
    );
  }
}
