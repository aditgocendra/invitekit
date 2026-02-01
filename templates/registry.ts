import FreeWeddingMinimalTemplate from "./free/wedding/minimal";
import FormWeddingMinimal from "./free/wedding/minimal/component/form-w-minimal";
import { freeWeddingMinimalConfig } from "./free/wedding/minimal/config";

export const TEMPLATE_REGISTRY = {
  [freeWeddingMinimalConfig.key]: {
    ...freeWeddingMinimalConfig,
    Component: FreeWeddingMinimalTemplate,
    FormComponent: FormWeddingMinimal,
  },
  // template lain...
} as const;
