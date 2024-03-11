import {
  Features,
  ValueType,
  FeatureOverwrites,
  RawFeatures,
  PaymentTypes,
} from "./features";

export interface Entity {
  name: string;
  description: string;
}

export interface Value<T> {
  valueType: T extends boolean
    ? "BOOLEAN"
    : T extends number
    ? "NUMERIC"
    : "TEXT";
  defaultValue: T;
}

export interface PricingContext {
  saasName: string;
  date: Date;
  currency: String;
  hasAnnualPayment: boolean;
  features: Features;
  plans: Plans;
}

export type Plans = Plan[];

export interface Plan extends Entity {
  currency: string;
  monthlyPrice: number;
  annualPrice: number;
  features: FeatureOverwrites | null;
}

type Noop = "";
type Lower = "<";
type LowerEquals = "<=";
type Equals = "==";
type GreaterEquals = ">=";
type Greater = ">";
type Different = "!=";
type And = "&&";
type Or = "||";
type None = "None";

export type UserContextAttributes = UserContextAttribute[];

export interface UserContextAttribute {
  id: string;
  type: ValueType;
}

export type Operators =
  | Noop
  | Lower
  | LowerEquals
  | Equals
  | GreaterEquals
  | Greater
  | Different
  | And
  | Or
  | None;

export type Tokens =
  | NoopToken
  | OperatorToken
  | UserContextToken
  | PlanContextToken
  | CustomValueToken
  | UnknownToken;

export type NoopToken = "Noop";
export type OperatorToken = "Operator";
export type UserContextToken = "UserContext";
export type PlanContextToken = "PlanContext";
export type CustomValueToken = "CustomValue";
export type UnknownToken = "Unknown";
export type ParsedToken = { type: Tokens; value: string };

export type Command = "add" | "edit" | "delete";

export interface Expression {
  operator: Operators;
  planContext: string;
  userContext?: string;
  customValue?: string;
}

export type RawPricingContext = Omit<PricingContext, "features" | "plans"> & {
  features: RawFeatures;
  plans: RawPlans;
};

export interface RawPlans {
  [key: string]: RawPlan;
}

export interface RawPlan {
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  features: FeatureOverwrites | null;
}
