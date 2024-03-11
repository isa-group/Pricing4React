import type { Entity, Value } from "./types";

export type ValueType = "TEXT" | "BOOLEAN" | "NUMERIC";

export type FeatureExpressions = {
  expression: string;
  serverExpression: string;
};

export type Type =
  | "AUTOMATION"
  | "DOMAIN"
  | "GUARANTEE"
  | "INFORMATION"
  | "INTEGRATION"
  | "MANAGEMENT"
  | "PAYMENT"
  | "SUPPORT";

export type BoolNumberOrString = Value<boolean> | Value<number> | Value<string>;

export type Automation = {
  type: "AUTOMATION";
  automationType: AutomationType;
} & Entity &
  BoolNumberOrString &
  FeatureExpressions;

export type AutomationType =
  | "BOT"
  | "FILTERING"
  | "TRACKING"
  | "TASK_AUTOMATION";

export type Domain = { type: "DOMAIN" } & Entity &
  BoolNumberOrString &
  FeatureExpressions;

export type Guarantee = {
  type: "GUARANTEE";
  docUrl: string;
} & Entity &
  BoolNumberOrString &
  FeatureExpressions;

export type Information = { type: "INFORMATION" } & Entity &
  BoolNumberOrString &
  FeatureExpressions;

export type Integration = {
  type: "INTEGRATION";
  integrationType: IntegrationType;
} & Entity &
  BoolNumberOrString &
  FeatureExpressions;

export type IntegrationType =
  | "API"
  | "EXTENSION"
  | "IDENTITY_PROVIDER"
  | "WEB_SAAS"
  | "MARKETPLACE"
  | "EXTERNAL_DEVICE";

export type Management = { type: "MANAGEMENT" } & Entity &
  BoolNumberOrString &
  FeatureExpressions;

export type Payment = {
  type: "PAYMENT";
} & Entity &
  Value<PaymentTypes> &
  FeatureExpressions;

export type PaymentTypes = PaymentType[];

export type PaymentType =
  | "CARD"
  | "GATEWAY"
  | "INVOICE"
  | "ACH"
  | "WIRE_TRANSFER"
  | "OTHER";

export type Support = { type: "SUPPORT" } & Entity &
  BoolNumberOrString &
  FeatureExpressions;

const ab: FeatureType = {
  name: "",
  description: "",
  type: "DOMAIN",
  valueType: "BOOLEAN",
  defaultValue: false,
  expression: "",
  serverExpression: "",
};

export type FeatureType =
  | Automation
  | Domain
  | Guarantee
  | Information
  | Integration
  | Management
  | Payment
  | Support;

export type Features = FeatureType[];

export type RawFeature =
  | Omit<Automation, "name">
  | Omit<Domain, "name">
  | Omit<Guarantee, "name">
  | Omit<Information, "name">
  | Omit<Integration, "name">
  | Omit<Guarantee, "name">
  | Omit<Payment, "name">
  | Omit<Support, "name">;

const a: RawFeature = {
  description: "",
  type: "INTEGRATION",
  integrationType: "API",
  expression: "",
  defaultValue: false,
  valueType: "NUMERIC",
  serverExpression: "",
};

export type RawFeatures = {
  [key: string]: RawFeature;
};

export interface RawFeatureAttributes {
  [key: string]: FeatureOverwrite;
}

export type FeatureOverwrite = {
  value?: string | boolean | number | PaymentTypes;
};

export interface FeatureOverwrites {
  [key: string]: FeatureOverwrite;
}
