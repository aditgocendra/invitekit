import BasicWeddingMinimalTemplate from "./basic/wedding/minimal";
import FormWeddingBasicMinimal from "./basic/wedding/minimal/component/form-bw-minimal";
import { basicWeddingMinimalConfig } from "./basic/wedding/minimal/config";
import FreeWeddingMinimalTemplate from "./free/wedding/minimal";
import FormWeddingMinimal from "./free/wedding/minimal/component/form-w-minimal";
import { freeWeddingMinimalConfig } from "./free/wedding/minimal/config";
import PremiumWeddingFilmTemplate from "./premium/wedding/film";
import FormWeddingPremiumFilm from "./premium/wedding/film/component/form-pw-film";
import { premiumWeddingFilmConfig } from "./premium/wedding/film/config";

export const TEMPLATE_REGISTRY = {
  [freeWeddingMinimalConfig.key]: {
    ...freeWeddingMinimalConfig,
    Component: FreeWeddingMinimalTemplate,
    FormComponent: FormWeddingMinimal,
  },
  [basicWeddingMinimalConfig.key]: {
    ...basicWeddingMinimalConfig,
    Component: BasicWeddingMinimalTemplate,
    FormComponent: FormWeddingBasicMinimal,
  },
  [premiumWeddingFilmConfig.key]: {
    ...premiumWeddingFilmConfig,
    Component: PremiumWeddingFilmTemplate,
    FormComponent: FormWeddingPremiumFilm,
  },
  // template lain...
} as const;
