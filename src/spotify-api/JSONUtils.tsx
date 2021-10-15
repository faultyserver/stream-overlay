const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z?$/;

type JSONable = JSONable[] | { [key: string]: JSONable } | string | number | null;
type JSONResult = JSONResult[] | { [key: string]: JSONResult } | Date | string | number | null;

function camelize(str: string) {
  return str.replace(/([-_][a-z])/gi, ($1: string) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
}

function isJSONObject(object: any): object is { [key: string]: JSONable } {
  return object === Object(object) && !Array.isArray(object) && typeof object !== "function";
}

function transform(object: JSONable): JSONResult {
  if (isJSONObject(object)) {
    const camelized: { [key: string]: JSONResult } = {};

    Object.keys(object).forEach((k) => {
      camelized[camelize(k)] = transform(object[k]);
    });

    return camelized;
  } else if (Array.isArray(object)) {
    return object.map((i) => {
      return transform(i);
    });
  }

  if (typeof object === "string" && DATE_REGEX.test(object)) {
    return new Date(Date.parse(object));
  }

  return object;
}

export function camelizeJSON<T>(json: { [key: string]: JSONable }): T {
  return (transform(json) as unknown) as T;
}
