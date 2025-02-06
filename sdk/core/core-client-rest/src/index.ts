import { AbortSignalLike } from "@azure/abort-controller";
import { KeyCredential, TokenCredential } from "@azure/core-auth";
import {
  createPipelineFromOptions,
  HttpClient,
  LogPolicyOptions,
  Pipeline,
  PipelineOptions,
  PipelinePolicy,
  PipelineRequest,
  PipelineResponse,
  RawHttpHeaders,
  RawHttpHeadersInput,
  RequestBodyType,
  RestError,
  TransferProgressEvent,
} from "@azure/core-rest-pipeline";
import { OperationTracingOptions } from "@azure/core-tracing";
import {
  __addCredentialPipelinePolicy,
  __createRestError,
  __getClient,
  __operationOptionsToRequestParameters,
} from "@typespec/ts-http-runtime/_internal/client";

/**
 * Adds a credential policy to the pipeline if a credential is provided. If none is provided, no policy is added.
 */
export function addCredentialPipelinePolicy(
  pipeline: Pipeline,
  endpoint: string,
  options?: AddCredentialPipelinePolicyOptions,
): void {
  return __addCredentialPipelinePolicy(pipeline, endpoint, options);
}

/**
 * Creates a rest error from a PathUnchecked response
 */
export function createRestError(response: PathUncheckedResponse): RestError;

/**
 * Creates a rest error from an error message and a PathUnchecked response
 */
export function createRestError(message: string, response: PathUncheckedResponse): RestError;

export function createRestError(
  messageOrResponse: string | PathUncheckedResponse,
  response?: PathUncheckedResponse,
): RestError {
  return __createRestError(messageOrResponse, response, { RestError });
}

/**
 * Creates a client with a default pipeline
 *
 * @param endpoint - Base endpoint for the client
 *
 * @param options - Client options
 */
export function getClient(endpoint: string, options?: ClientOptions): Client;

/**
 * Creates a client with a default pipeline
 *
 * @param endpoint - Base endpoint for the client
 *
 * @param credentials - Credentials to authenticate the requests
 *
 * @param options - Client options
 */
export function getClient(
  endpoint: string,
  credentials?: TokenCredential | KeyCredential,
  options?: ClientOptions,
): Client;

export function getClient(
  endpoint: string,
  credentialOrOptions?: TokenCredential | KeyCredential | ClientOptions,
  options?: ClientOptions,
): Client {
  return __getClient(endpoint, credentialOrOptions, options, {
    legacyRawResponseCallback: true,
    createPipelineFromOptions,
  });
}

/**
 * Helper function to convert OperationOptions to RequestParameters
 *
 * @param options - the options that are used by Modular layer to send the request
 *
 * @returns the result of the conversion in RequestParameters of RLC layer
 */
export function operationOptionsToRequestParameters(options: OperationOptions): RequestParameters {
  return __operationOptionsToRequestParameters(options);
}

/**
 * Optional parameters for adding a credential policy to the pipeline.
 */
export interface AddCredentialPipelinePolicyOptions {
  /**
   * Options related to the client.
   */
  clientOptions?: ClientOptions;
  /**
   * The credential to use.
   */
  credential?: TokenCredential | KeyCredential;
}

/**
 * Used to configure additional policies added to the pipeline at construction.
 */
export interface AdditionalPolicyConfig {
  /**
   * A policy to be added.
   */
  policy: PipelinePolicy;
  /**
   * Determines if this policy be applied before or after retry logic. Only use `perRetry` if you need to modify the request again each time the operation is retried due to retryable service issues.
   */
  position: "perCall" | "perRetry";
}

/**
 * Shape of a Rest Level Client
 */
export interface Client {
  /**
   * This method will be used to send request that would check the path to provide strong types. When used by the codegen this type gets overridden with the generated types. For example:
   * ```typescript snippet:path_example
   * import { Client } from "@azure-rest/core-client";
   *
   * type MyClient = Client & {
   *   path: Routes;
   * };
   * ```
   *
   */
  path: Function;
  /**
   * This method allows arbitrary paths and doesn't provide strong types
   */
  pathUnchecked: PathUnchecked;
  /**
   * The pipeline used by this client to make requests
   */
  pipeline: Pipeline;
}

/**
 * The error object.
 */
export interface ErrorModel {
  /**
   * One of a server-defined set of error codes.
   */
  code: string;
  /**
   * An array of details about specific errors that led to this reported error.
   */
  details: Array<ErrorModel>;
  /**
   * An object containing more specific information than the current object about the error.
   */
  innererror?: InnerError;
  /**
   * A human-readable representation of the error.
   */
  message: string;
  /**
   * The target of the error.
   */
  target?: string;
}

/**
 * A response containing error details.
 */
export interface ErrorResponse {
  /**
   * The error object.
   */
  error: ErrorModel;
}

/**
 * Wrapper object for http request and response. Deserialized object is stored in the `parsedBody` property when the response body is received in JSON.
 */
export interface FullOperationResponse extends PipelineResponse {
  /**
   * The response body as parsed JSON.
   */
  parsedBody?: RequestBodyType;
  /**
   * The raw HTTP response headers.
   */
  rawHeaders?: RawHttpHeaders;
  /**
   * The request that generated the response.
   */
  request: PipelineRequest;
}

/**
 * An object containing more specific information about the error. As per Microsoft One API guidelines - https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md#7102-error-condition-responses.
 */
export interface InnerError {
  /**
   * One of a server-defined set of error codes.
   */
  code: string;
  /**
   * Inner error.
   */
  innererror?: InnerError;
}

/**
 * The base options type for all operations.
 */
export interface OperationOptions {
  /**
   * The signal which can be used to abort requests.
   */
  abortSignal?: AbortSignalLike;
  /**
   * A function to be called each time a response is received from the server while performing the requested operation. May be called multiple times.
   */
  onResponse?: RawResponseCallback;
  /**
   * Options used when creating and sending HTTP requests for this operation.
   */
  requestOptions?: OperationRequestOptions;
  /**
   * Options used when tracing is enabled.
   */
  tracingOptions?: OperationTracingOptions;
}

/**
 * Options used when creating and sending HTTP requests for this operation.
 */
export interface OperationRequestOptions {
  /**
   * Set to true if the request is sent over HTTP instead of HTTPS
   */
  allowInsecureConnection?: boolean;
  /**
   * User defined custom request headers that will be applied before the request is sent.
   */
  headers?: RawHttpHeadersInput;
  /**
   * Callback which fires upon download progress.
   */
  onDownloadProgress?: (progress: TransferProgressEvent) => void;
  /**
   * Callback which fires upon upload progress.
   */
  onUploadProgress?: (progress: TransferProgressEvent) => void;
  /**
   * Set to true if you want to skip encoding the path parameters
   */
  skipUrlEncoding?: boolean;
  /**
   * The number of milliseconds a request can take before automatically being terminated.
   */
  timeout?: number;
}

/**
 * An object that can be passed as a path parameter, allowing for additional options to be set relating to how the parameter is encoded.
 */
export interface PathParameterWithOptions {
  /**
   * Whether to allow for reserved characters in the value. If set to true, special characters such as '/' in the parameter's value will not be URL encoded. Defaults to false.
   */
  allowReserved?: boolean;
  /**
   * The value of the parameter.
   */
  value: string | number;
}

/**
 * Defines the methods that can be called on a resource
 */
export interface ResourceMethods<TResponse = PromiseLike<PathUncheckedResponse>> {
  /**
   * Definition of the DELETE HTTP method for a resource
   */
  delete: (options?: RequestParameters) => TResponse;
  /**
   * Definition of the GET HTTP method for a resource
   */
  get: (options?: RequestParameters) => TResponse;
  /**
   * Definition of the HEAD HTTP method for a resource
   */
  head: (options?: RequestParameters) => TResponse;
  /**
   * Definition of the OPTIONS HTTP method for a resource
   */
  options: (options?: RequestParameters) => TResponse;
  /**
   * Definition of the PATCH HTTP method for a resource
   */
  patch: (options?: RequestParameters) => TResponse;
  /**
   * Definition of the POST HTTP method for a resource
   */
  post: (options?: RequestParameters) => TResponse;
  /**
   * Definition of the PUT HTTP method for a resource
   */
  put: (options?: RequestParameters) => TResponse;
  /**
   * Definition of the TRACE HTTP method for a resource
   */
  trace: (options?: RequestParameters) => TResponse;
}

/**
 * General options that a Rest Level Client can take
 */
export type ClientOptions = PipelineOptions & {
  credentials?: {
    scopes?: string[];
    apiKeyHeaderName?: string;
  };
  baseUrl?: string;
  endpoint?: string;
  apiVersion?: string;
  allowInsecureConnection?: boolean;
  additionalPolicies?: AdditionalPolicyConfig[];
  httpClient?: HttpClient;
  loggingOptions?: LogPolicyOptions;
};

/**
 * Http Response which body is a NodeJS stream object
 */
export type HttpBrowserStreamResponse = HttpResponse & {
  body?: ReadableStream<Uint8Array>;
};

/**
 * Http Response which body is a NodeJS stream object
 */
export type HttpNodeStreamResponse = HttpResponse & {
  body?: NodeJS.ReadableStream;
};

/**
 * Represents the shape of an HttpResponse
 */
export type HttpResponse = {
  request: PipelineRequest;
  headers: RawHttpHeaders;
  body: unknown;
  status: string;
};

/**
 * Helper type used to detect parameters in a path template text surrounded by \{\} will be considered a path parameter
 */
export type PathParameters<TRoute extends string> =
  TRoute extends `${infer _Head}/{${infer _Param}}${infer Tail}`
    ? [
        pathParameter: string | number | PathParameterWithOptions,
        ...pathParameters: PathParameters<Tail>,
      ]
    : [];

/**
 * Defines the signature for pathUnchecked.
 */
export type PathUnchecked = <TPath extends string>(
  path: TPath,
  ...args: PathParameters<TPath>
) => ResourceMethods<StreamableMethod>;

/**
 * Type to use with pathUnchecked, overrides the body type to any to allow flexibility
 */
export type PathUncheckedResponse = HttpResponse & {
  body: any;
};

/**
 * A function to be called each time a response is received from the server while performing the requested operation. May be called multiple times.
 *
 * This callback will be called with two parameters: the raw response, including headers and response body; and an error object which will be provided if an error was thrown while processing the request. The third __legacyError parameter is provided for backwards compatability only and will have an identical value to the `error` parameter.
 */
export type RawResponseCallback = (
  rawResponse: FullOperationResponse,
  error?: unknown,
  __legacyError?: unknown,
) => void;

/**
 * Shape of the default request parameters, this may be overridden by the specific request types to provide strong types
 */
export type RequestParameters = {
  headers?: RawHttpHeadersInput;
  accept?: string;
  body?: unknown;
  queryParameters?: Record<string, unknown>;
  contentType?: string;
  allowInsecureConnection?: boolean;
  skipUrlEncoding?: boolean;
  pathParameters?: Record<string, any>;
  timeout?: number;
  onUploadProgress?: (progress: TransferProgressEvent) => void;
  onDownloadProgress?: (progress: TransferProgressEvent) => void;
  abortSignal?: AbortSignalLike;
  tracingOptions?: OperationTracingOptions;
  onResponse?: RawResponseCallback;
};

/**
 * Defines the type for a method that supports getting the response body as a raw stream
 */
export type StreamableMethod<TResponse = PathUncheckedResponse> = PromiseLike<TResponse> & {
  asNodeStream: () => Promise<HttpNodeStreamResponse>;
  asBrowserStream: () => Promise<HttpBrowserStreamResponse>;
};
