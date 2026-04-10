// This file is manually maintained (no codegen CLI used).
import { createRootRoute, createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as passwordGeneratorRoute } from './routes/tools/password-generator';
import { Route as textShareRoute } from './routes/tools/text-share';
import { Route as jsonFormatterRoute } from './routes/tools/json-formatter';
import { Route as base64Route } from './routes/tools/base64';
import { Route as uuidGeneratorRoute } from './routes/tools/uuid-generator';
import { Route as hashGeneratorRoute } from './routes/tools/hash-generator';

const rootWithChildren = rootRoute.addChildren([
  indexRoute,
  passwordGeneratorRoute,
  textShareRoute,
  jsonFormatterRoute,
  base64Route,
  uuidGeneratorRoute,
  hashGeneratorRoute,
]);

export const routeTree = rootWithChildren;
