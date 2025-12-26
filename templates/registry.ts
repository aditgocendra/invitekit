import FreeWeddingMinimalTemplate from "./free/wedding/minimal";
import { freeWeddingMinimalConfig } from "./free/wedding/minimal/config";

export const TEMPLATE_REGISTRY = {
  [freeWeddingMinimalConfig.key]: {
    ...freeWeddingMinimalConfig,
    Component: FreeWeddingMinimalTemplate,
  },
  // template lain...
} as const;
