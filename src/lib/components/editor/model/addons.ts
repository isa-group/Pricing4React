import {
  serializePlanFeatures,
  serializePlanUsageLimits,
} from "../serializers";
import { ValueOverwrite, FeatureOverwrite } from "../types/index";
import { MapFeatureValue, MapStandardValue } from "./plans";

export type AddOns = {
  [key: string]: AddOn;
};

export type AddOn = {
  availableFor: string[];
  unit: string;
  price: number | null;
  annualPrice: number | null;
  monthlyPrice: number | null;
  features: FeatureOverwrite | null;
  usageLimits: ValueOverwrite | null;
  usageLimitsExtensions: ValueOverwrite | null;
};

export class StandardAddOn {
  constructor(
    public name: string,
    public availableFor: string[],
    public unit: string,
    public price: number | null,
    public annualPrice: number | null,
    public monthlyPrice: number | null,
    public features: Map<string, MapFeatureValue> | null,
    public usageLimits: Map<string, MapStandardValue> | null,
    public usageLimitsExtensions: Map<string, MapStandardValue> | null
  ) {
    if (price === null && annualPrice === null && monthlyPrice === null) {
      throw Error(
        "You have to set a general price or both annual and monthly price."
      );
    }

    if (price !== null && annualPrice !== null && monthlyPrice !== null) {
      throw Error(
        "You cannot set a genereal price an annual and monthly price. Choose one of them"
      );
    }
  }

  serialize(): AddOn {
    return {
      availableFor: this.availableFor,
      unit: this.unit,
      price: this.price,
      annualPrice: this.annualPrice,
      monthlyPrice: this.monthlyPrice,
      features: serializePlanFeatures(this.features),
      usageLimits: serializePlanUsageLimits(this.usageLimits),
      usageLimitsExtensions: serializePlanUsageLimits(
        this.usageLimitsExtensions
      ),
    };
  }
}
