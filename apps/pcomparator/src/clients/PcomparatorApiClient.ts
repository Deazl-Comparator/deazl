import { headers } from "next/headers";
import createClient, { type Middleware } from "~/libraries/openapi-fetch/index";
import type { paths } from "~/types/schema";

const pcomparatorApiEndpoint = process.env.PCOMPARATOR_API_ENDPOINT;
if (!pcomparatorApiEndpoint) {
  throw new Error("The environment variable 'PCOMPARATOR_API_ENDPOINT' is missing");
}

const PcomparatorApiClient = createClient<paths>({
  baseUrl: `${process.env.PCOMPARATOR_API_ENDPOINT}/api/`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

const middleware: Middleware = {
  async onResponse({ request, options, response }) {
    // Transform 202 into error to allow retry at higher level
    if (response.status === 202)
      throw new Error(`${response.url}: ${response.status} ${response.statusText}`);

    return response;
  }
};

const middlewareAuthenticated: Middleware = {
  async onRequest({ request }) {
    request.headers.set("cookie", (await headers()).get("cookie")!);

    return request;
  }
};

PcomparatorApiClient.use(middleware);

const pcomparatorAuthenticatedApiClient = createClient<paths>({
  baseUrl: `${process.env.PCOMPARATOR_API_ENDPOINT}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

pcomparatorAuthenticatedApiClient.use(middlewareAuthenticated);

export { PcomparatorApiClient, pcomparatorAuthenticatedApiClient };
