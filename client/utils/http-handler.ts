import {
  FetchHttpHandler,
  FetchHttpHandlerOptions,
} from "@aws-sdk/fetch-http-handler";
import { HeaderBag, HttpHandlerOptions } from "@aws-sdk/types";
import { buildQueryString } from "@aws-sdk/querystring-builder";
import { HttpResponse, HttpRequest } from "@aws-sdk/protocol-http";
import { Subject } from "rxjs";

// MyHttpHandler allows us to inject a progress handler into the S3Client

export class MyHttpHandler extends FetchHttpHandler {
  private myRequestTimeout;

  onProgress$: Subject<{ path: string; progressEvent: ProgressEvent }> =
    new Subject();

  constructor({ requestTimeout }: FetchHttpHandlerOptions = {}) {
    super({ requestTimeout });
    this.myRequestTimeout = requestTimeout;
  }

  handle(
    request: HttpRequest,
    { abortSignal }: HttpHandlerOptions = {}
  ): Promise<{ response: HttpResponse }> {
    // we let XHR only handle PUT requests with body (as we want to have progress events here), the rest by fetch
    if (request.method === "PUT" && request.body) {
      return this.handleByXhr(request, { abortSignal });
    }
    return super.handle(request, { abortSignal });
  }

  /**
   * handles a request by XHR instead of fetch
   * this is a copy the `handle` method of the `FetchHttpHandler` class of @aws-sdk/fetch-http-handler
   * replacing the `Fetch`part with XHR
   */
  private handleByXhr(
    request: HttpRequest,
    { abortSignal }: HttpHandlerOptions = {}
  ): Promise<{ response: HttpResponse }> {
    const requestTimeoutInMs = this.myRequestTimeout;

    // if the request was already aborted, prevent doing extra work
    if (abortSignal?.aborted) {
      const abortError = new Error("Request aborted");
      abortError.name = "AbortError";
      return Promise.reject(abortError);
    }

    let path = request.path;
    if (request.query) {
      const queryString = buildQueryString(request.query);
      if (queryString) {
        path += `?${queryString}`;
      }
    }

    const { port, method } = request;
    const url = `${request.protocol}//${request.hostname}${
      port ? `:${port}` : ""
    }${path}`;
    // Request constructor doesn't allow GET/HEAD request with body
    // ref: https://github.com/whatwg/fetch/issues/551
    const body =
      method === "GET" || method === "HEAD" ? undefined : request.body;
    const requestOptions: RequestInit = {
      body,
      headers: new Headers(request.headers),
      method,
    };

    const myXHR = new XMLHttpRequest();
    const xhrPromise = new Promise<{
      headers: string[];
      body: Blob;
      status: number;
    }>((resolve, reject) => {
      try {
        myXHR.responseType = "blob";

        // bind the events
        myXHR.onload = (progressEvent) => {
          resolve({
            body: myXHR.response,
            headers: myXHR.getAllResponseHeaders().split("\n"),
            status: myXHR.status,
          });
        };
        myXHR.onerror = (progressEvent) =>
          reject(new Error(myXHR.responseText));
        myXHR.onabort = (progressEvent) => {
          const abortError = new Error("Request aborted");
          abortError.name = "AbortError";
          reject(abortError);
        };

        // progress event musst be bound to the `upload` property
        if (myXHR.upload) {
          myXHR.upload.onprogress = (progressEvent) =>
            this.onProgress$.next({ path, progressEvent });
        }

        myXHR.open(requestOptions.method!, url);
        // append headers
        if (requestOptions.headers) {
          (requestOptions.headers as Headers).forEach(
            (headerVal, headerKey, headers) => {
              if (
                ["host", "content-length"].indexOf(headerKey.toLowerCase()) >= 0
              ) {
                // avoid "refused to set unsafe header" error message
                return;
              }

              myXHR.setRequestHeader(headerKey, headerVal);
            }
          );
        }
        myXHR.send(requestOptions.body as XMLHttpRequestBodyInit);
      } catch (e) {
        console.error("S3 XHRHandler error", e);
        reject(e);
      }
    });

    const raceOfPromises = [
      xhrPromise.then((response) => {
        const fetchHeaders = response.headers;
        const transformedHeaders: HeaderBag = {};

        fetchHeaders.forEach((header) => {
          const name = header.substr(0, header.indexOf(":") + 1);
          const val = header.substr(header.indexOf(":") + 1);
          if (name && val) {
            transformedHeaders[name] = val;
          }
        });

        const hasReadableStream = response.body !== undefined;

        // Return the response with buffered body
        if (!hasReadableStream) {
          return response.body.text().then((body) => ({
            response: new HttpResponse({
              headers: transformedHeaders,
              statusCode: response.status,
              body,
            }),
          }));
        }
        // Return the response with streaming body
        return {
          response: new HttpResponse({
            headers: transformedHeaders,
            statusCode: response.status,
            body: response.body,
          }),
        };
      }),
      this.requestTimeoutFn(requestTimeoutInMs),
    ];
    if (abortSignal) {
      raceOfPromises.push(
        new Promise<never>((resolve, reject) => {
          abortSignal.onabort = () => {
            myXHR.abort();
          };
        })
      );
    }
    return Promise.race(raceOfPromises);
  }

  private requestTimeoutFn(timeoutInMs = 0): Promise<never> {
    return new Promise((resolve, reject) => {
      if (timeoutInMs) {
        setTimeout(() => {
          const timeoutError = new Error(
            `Request did not complete within ${timeoutInMs} ms`
          );
          timeoutError.name = "TimeoutError";
          reject(timeoutError);
        }, timeoutInMs);
      }
    });
  }
}
