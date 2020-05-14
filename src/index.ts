import { Request, Response } from "cross-fetch";
import Negotiator from "negotiator";
import escapeHTML from "escape-html";

/**
 * Used to properly space HTML output.
 */
const DOUBLE_SPACE_REGEXP = /\x20{2}/g;

/**
 * Boom-compatible output.
 */
interface Output {
  status: number;
  headers: Record<string, string>;
  payload: object;
}

/**
 * Convert an error into an "output" object.
 */
function toOutput(err: any, production: boolean): Output {
  const error: {
    output?: {
      statusCode?: number;
      headers?: Record<string, string>;
      payload?: any;
    };
    statusCode?: number;
    status?: number;
    headers?: Record<string, string>;
    message?: string;
  } =
    err == null
      ? { message: `Empty error: ${err}` }
      : typeof err === "object"
      ? err
      : { message: String(err) };

  const output = error.output || {};
  const status =
    Number(output.statusCode || error.statusCode || error.status) || 500;
  const headers = output.headers || error.headers || {};
  const payload = output.payload || {
    status,
    error: `${status} Error`,
    message: (production ? undefined : error.message) || "Error",
  };

  return { status, headers, payload };
}

/**
 * Render HTML response.
 */
function renderHTML(req: Request, output: Output) {
  const content = escapeHTML(JSON.stringify(output.payload, null, 2));

  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>${content.replace(
      DOUBLE_SPACE_REGEXP,
      " &nbsp;"
    )}</pre></body></html>`,
    {
      status: output.status,
      headers: {
        "Content-Type": "text/html",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'self'",
        ...output.headers,
      },
    }
  );
}

/**
 * Send JSON response.
 */
function renderJSON(req: Request, output: Output) {
  return new Response(JSON.stringify(output.payload), {
    status: output.status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      ...output.headers,
    },
  });
}

/**
 * Render HTTP response.
 */
function render(req: Request, output: Output) {
  const negotiator = new Negotiator({
    headers: {
      accept: req.headers.get("accept") || undefined,
    },
  });

  const type = negotiator.mediaType(["text/html", "application/json"]);
  if (type === "text/html") return renderHTML(req, output);
  return renderJSON(req, output);
}

/**
 * Error handler options.
 */
export interface Options {
  production?: boolean;
}

/**
 * Render errors into a response object.
 */
export function errorHandler(
  req: Request,
  options: Options = {}
): (err: any) => Response {
  const production = options.production !== false;

  return function errorMiddleware(err: unknown) {
    return render(req, toOutput(err, production));
  };
}
