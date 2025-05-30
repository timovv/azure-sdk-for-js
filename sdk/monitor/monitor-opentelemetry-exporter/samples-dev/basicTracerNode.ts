// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This example shows how to use
 * [@opentelemetry/sdk-trace-base](https://github.com/open-telemetry/opentelemetry-js/tree/master/packages/opentelemetry-sdk-trace-base)
 * to instrument a simple Node.js application - e.g. a batch job.
 *
 * @summary use opentelemetry tracing to instrument a Node.js application. Basic use of Tracing in Node.js application.
 */

import * as opentelemetry from "@opentelemetry/api";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { BasicTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter";

// Load the .env file if it exists
import "dotenv/config";

// Configure span processor to send spans to the exporter
const exporter = new AzureMonitorTraceExporter({
  connectionString:
    // Replace with your Application Insights Connection String
    process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] ||
    "InstrumentationKey=00000000-0000-0000-0000-000000000000;",
});
const provider = new BasicTracerProvider({
  resource: resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]: "basic-service",
  }),
  spanProcessors: [new SimpleSpanProcessor(exporter)],
});

/**
 * Initialize the OpenTelemetry APIs to use the BasicTracerProvider bindings.
 *
 * This registers the tracer provider with the OpenTelemetry API as the global
 * tracer provider. This means when you call API methods like
 * `opentelemetry.trace.getTracer`, they will use this tracer provider. If you
 * do not register a global tracer provider, instrumentation which calls these
 * methods will receive no-op implementations.
 */
// Register the tracer provider with the OpenTelemetry API
opentelemetry.trace.setGlobalTracerProvider(provider);
const tracer = opentelemetry.trace.getTracer("example-basic-tracer-node");

export async function main(): Promise<void> {
  // Create a span. A span must be closed.
  const parentSpan = tracer.startSpan("main");
  for (let i = 0; i < 10; i += 1) {
    doWork(parentSpan);
  }
  // Be sure to end the span.
  parentSpan.end();

  // flush and close the connection.
  await provider.shutdown();
}

function doWork(parent: opentelemetry.Span): void {
  // Start another span. In this example, the main method already started a
  // span, so that'll be the parent span, and this will be a child span.
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parent);
  const span = tracer.startSpan("doWork", undefined, ctx);

  // simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }

  // Set attributes to the span.
  span.setAttribute("key", "value");

  // Annotate our span to capture metadata about our operation
  span.addEvent("invoking doWork");

  span.end();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
