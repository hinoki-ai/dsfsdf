/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
  actionGeneric,
  httpActionGeneric,
  mutationGeneric,
  queryGeneric,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to add it to your app's API.
 */
export const query: QueryBuilder<DataModel, "public"> = queryGeneric;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to add it to your app's API.
 */
export const mutation: MutationBuilder<DataModel, "public"> = mutationGeneric;

/**
 * Define a query that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to read from your Convex database. It will not be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to add it to your app's API.
 */
export const internalQuery: QueryBuilder<DataModel, "internal"> =
  internalQueryGeneric;

/**
 * Define a mutation that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to modify your Convex database. It will not be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to add it to your app's API.
 */
export const internalMutation: MutationBuilder<DataModel, "internal"> =
  internalMutationGeneric;

/**
 * Define an action in this Convex app's public API.
 *
 * An action can run any JavaScript code, including non-deterministic
 * code and code with side-effects. Actions can also fetch data from
 * and send data to third-party APIs.
 *
 * @param func - The action function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped action. Include this as an `export` to add it to your app's API.
 */
export const action: ActionBuilder<DataModel, "public"> = actionGeneric;

/**
 * Define an action that is only accessible from other Convex functions (but not from the client).
 *
 * @param func - The action function. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped action. Include this as an `export` to add it to your app's API.
 */
export const internalAction: ActionBuilder<DataModel, "internal"> =
  internalActionGeneric;

/**
 * Define an HTTP action.
 *
 * This function will be used to respond to HTTP requests received by your
 * Convex deployment.
 *
 * @param func - The function to route and run in response to HTTP requests.
 * @returns The wrapped endpoint function. Import this function in `convex/http.js` and
 * include it in your routes.
 */
export const httpAction: HttpActionBuilder = httpActionGeneric;