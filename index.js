import dotenv from "dotenv";
dotenv.config();
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CacheGet,
  CreateCache,
  ListCaches,
  CacheSet,
  CacheClient,
  Configurations,
  CredentialProvider,
} from "@gomomento/sdk";

import { RateLimiter } from "limiter-es6-compat";
import crypto from "crypto";

const CACHE_NAME = "momento-playground";

async function setRandomKey(cacheClient, cacheName) {
    console.log(`setting ${crypto.randomUUID()}`);
    const key = crypto.randomUUID()
    const setResponse = await cacheClient.set(
      `${cacheName}`,
      key,
      `value-${crypto.randomUUID()}`
    );
    if (setResponse instanceof CacheSet.Success) {
      console.log(`Key '${key}' stored successfully`);
    } else if (setResponse instanceof CacheSet.Error) {
      throw new Error(
        `An error occurred while attempting to store key 'test-key' in cache '${cacheName}': ${setResponse.errorCode()}: ${setResponse.toString()}`
      );
    }
}

async function main() {
  const cacheClient = await CacheClient.create({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: "MOMENTO_AUTH_TOKEN",
    }),
    defaultTtlSeconds: 60,
  });

  const createCacheResponse = await cacheClient.createCache(CACHE_NAME);
  if (createCacheResponse instanceof CreateCache.Success) {
    console.log(`Cache '${CACHE_NAME}' created`);
  } else if (createCacheResponse instanceof CreateCache.AlreadyExists) {
    console.log(`Cache '${CACHE_NAME}' already exists`);
  } else if (createCacheResponse instanceof CreateCache.Error) {
    throw new Error(
      `An error occurred while attempting to create cache '${CACHE_NAME}': ${result.errorCode()}: ${result.toString()}`
    );
  }

  const result = await cacheClient.listCaches();
  if (result instanceof ListCaches.Success) {
    console.log(
      `Caches:\n${result
        .getCaches()
        .map((c) => c.getName())
        .join("\n")}\n\n`
    );
  } else if (result instanceof ListCaches.Error) {
    throw new Error(
      `An error occurred while attempting to list caches: ${result.errorCode()}: ${result.toString()}`
    );
  }

  const setResponse = await cacheClient.set(
    `${CACHE_NAME}`,
    "test-key",
    "test-value"
  );
  if (setResponse instanceof CacheSet.Success) {
    console.log("Key 'test-key' stored successfully");
  } else if (setResponse instanceof CacheSet.Error) {
    throw new Error(
      `An error occurred while attempting to store key 'test-key' in cache '${CACHE_NAME}': ${setResponse.errorCode()}: ${setResponse.toString()}`
    );
  }

  const getResponse = await cacheClient.get(`${CACHE_NAME}`, "test-key");
  if (getResponse instanceof CacheGet.Hit) {
    console.log(
      `Retrieved value for key 'test-key': ${getResponse.valueString()}`
    );
  } else if (getResponse instanceof CacheGet.Miss) {
    console.log("Key 'test-key' was not found in cache 'test-cache'");
  } else if (getResponse instanceof CacheGet.Error) {
    throw new Error(
      `An error occurred while attempting to get key 'test-key' from cache 'test-cache': ${getResponse.errorCode()}: ${getResponse.toString()}`
    );
  }

//   const limiter = new RateLimiter({
//     tokensPerInterval: 100,
//     interval: "second",
//   });
//   while (true) {
//     const remainingRequests = await limiter.removeTokens(1);
//     console.log(`remainingRequests: ${remainingRequests}`)
//     if (remainingRequests < 1) {
//       console.log("no token available");
//     } else {
//         await setRandomKey(cacheClient, CACHE_NAME);
//     }

//   }
}

main().catch((e) => {
  console.error(
    `Uncaught exception while running example: ${JSON.stringify(e)}`
  );
  throw e; // Depending on the environment, this might not be necessary.
});
