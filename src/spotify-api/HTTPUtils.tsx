import queryString from "query-string";
import snakecaseKeys from "snakecase-keys";

import { API_ENDPOINT } from "./Config";
import { camelizeJSON } from "./JSONUtils";

export enum HTTPVerb {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const Encoders = {
  JSON: {
    module: { ...JSON, stringify: (data: any) => JSON.stringify(snakecaseKeys(data)) },
    contentType: "application/json",
  },
  QUERY: {
    module: queryString,
    contentType: "application/x-www-form-urlencoded",
  },
};

let authToken: string | undefined;
export function setAuth(token: string) {
  authToken = token;
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 400) {
    return response;
  } else {
    throw response;
  }
}

function getDefaultHeaders(method: string) {
  const headers: { [header: string]: any } = {
    "Content-Type": "application/json",
  };

  if (authToken != null) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

type CommonOptions = {
  headers?: { [header: string]: any };
};

type GetOptions = CommonOptions;

export async function get<T>(url: string, queryParams?: object, opts: GetOptions = {}) {
  const { headers } = opts;
  const query = queryParams != null ? "?" + queryString.stringify(queryParams) : "";

  return send<T>(HTTPVerb.GET, `${url}${query}`, { headers });
}

type PostOptions = CommonOptions & {
  encoder?: typeof Encoders[keyof typeof Encoders];
};

export async function post<T>(url: string, data: object, opts: PostOptions = {}) {
  const { headers, encoder = Encoders.JSON } = opts;

  return send<T>(HTTPVerb.POST, url, {
    headers: {
      "Content-Type": encoder.contentType,
      ...headers,
    },
    body: encoder.module.stringify(data),
  });
}

export async function put<T>(url: string, data: object, opts: PostOptions = {}) {
  const { headers, encoder = Encoders.JSON } = opts;

  return send<T>(HTTPVerb.PUT, url, {
    headers: {
      "Content-Type": encoder.contentType,
      ...headers,
    },
    body: encoder.module.stringify(data),
  });
}

export async function patch<T>(url: string, data?: object, opts: PostOptions = {}) {
  const { headers, encoder = Encoders.JSON } = opts;

  return send<T>(HTTPVerb.PATCH, url, {
    headers: {
      "Content-Type": encoder.contentType,
      ...headers,
    },
    body: data ? encoder.module.stringify(data) : undefined,
  });
}

type DeleteOptions = CommonOptions;

export async function del(url: string, opts: DeleteOptions = {}) {
  const { headers } = opts;

  return send(HTTPVerb.DELETE, url, {
    headers: {
      ...headers,
    },
  });
}

export interface HTTPResponse<PayloadT> {
  json: PayloadT;
  statusCode: number;
}

export async function send<T>(
  verb: HTTPVerb,
  url: string,
  options?: RequestInit,
): Promise<HTTPResponse<T>> {
  // Prepend API_BASE_URL on plain-path requests
  const resolvedUrl = url[0] === "/" ? `${API_ENDPOINT}${url}` : url;

  const response = await fetch(resolvedUrl, {
    method: verb,
    ...options,
    headers: new Headers({
      ...getDefaultHeaders(verb),
      ...options?.headers,
    }),
  });
  checkStatus(response);

  try {
    const json = await response.json();
    const parsed = camelizeJSON<T>(json);

    return Promise.resolve({
      json: parsed,
      statusCode: response.status,
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

export default {
  setAuth,
  get,
  post,
  put,
  patch,
  delete: del,
  send,
  Encoders,
};
