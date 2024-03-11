import type {
  Expression,
  Operators,
  ParsedToken,
  Plan,
  Plans,
  RawPlan,
  RawPlans,
  RawPricingContext,
  UserContextAttributes,
} from "../types";

import type {
  Features,
  FeatureOverwrite,
  ValueType,
  FeatureType,
  RawFeatureAttributes,
  RawFeature,
  RawFeatures,
  FeatureOverwrites,
} from "../features";

export function computeEvaluation(
  leftOperand: string,
  operator: Operators,
  rightOperand: string
) {
  switch (operator) {
    case "":
      return "";
    case "<":
    case "<=":
    case "==":
    case ">=":
    case ">":
    case "!=":
    case "||":
    case "&&":
      return `${leftOperand} ${operator} ${rightOperand}`;
    case "None":
      return leftOperand;
  }
}

export function computeValueType(value: any): ValueType {
  switch (typeof value) {
    case "string":
      return "TEXT";
    case "number":
      return "NUMERIC";
    case "boolean":
      return "BOOLEAN";
    default:
      return "TEXT";
  }
}

export function parseAttributeExpressionToUserAttributes(
  attributes: Features
): UserContextAttributes {
  if (attributes.length === 0) {
    return [];
  }
  return attributes.map((attribute) => {
    const expression = parseExpression(attribute.expression);

    return { type: attribute.valueType, id: expression.userContext ?? "" };
  });
}

export function parseExpression(expression: string): Expression {
  const tokens = expression
    .trim()
    .split(" ")
    .map((token) => parseToken(token));

  let res: Expression = { operator: "", planContext: "" };

  tokens.map((token) => {
    switch (token.type) {
      case "PlanContext": {
        res.planContext = token.value;
        break;
      }
      case "UserContext": {
        res.userContext = token.value;
        break;
      }
      case "CustomValue": {
        res.customValue = token.value;
        break;
      }
      case "Operator":
        res.operator = token.value as Operators;
      case "Noop":
      case "Unknown":
        break;
    }
  });
  return res;
}

function parseToken(token: string): ParsedToken {
  const userContextRegex = /userContext\['(\w+)'\]/gm;
  const planContextRegex = /planContext\['(\w+)'\]/gm;
  const userContextMatch = Array.from(token.matchAll(userContextRegex));
  const planContextMatch = Array.from(token.matchAll(planContextRegex));

  if (token === "<") {
    return { type: "Operator", value: "<" };
  } else if (token === "<=") {
    return { type: "Operator", value: "<=" };
  } else if (token === "==") {
    return { type: "Operator", value: "==" };
  } else if (token === ">=") {
    return { type: "Operator", value: ">=" };
  } else if (token === ">") {
    return { type: "Operator", value: ">" };
  } else if (token === "!=") {
    return { type: "Operator", value: "!=" };
  } else if (token === "&&") {
    return { type: "Operator", value: "&&" };
  } else if (token === "||") {
    return { type: "Operator", value: "||" };
  } else if (token === "None") {
    return { type: "Operator", value: "None" };
  } else if (token === "") {
    return { type: "Noop", value: "" };
  } else if (userContextMatch.length === 0 && planContextMatch.length > 0) {
    return { type: "PlanContext", value: planContextMatch[0][1] };
  } else if (userContextMatch.length > 0 && planContextMatch.length === 0) {
    return { type: "UserContext", value: userContextMatch[0][1] };
  } else if (userContextMatch.length === 0 && planContextMatch.length === 0) {
    return { type: "CustomValue", value: token };
  } else {
    return { type: "Unknown", value: "" };
  }
}

/*
export function buildRawPricingContext(
  attributes: Features,
  plans: Plans
): RawPricingContext {
  return {
    features: attributesToRawAttributes(attributes),
    plans: plansToRawPlans(plans),
  };
}
*/

function attributesToRawAttributes(features: Features): RawFeatureAttributes {
  return Object.fromEntries(
    features.map((feature) => {
      const rawAttributes: FeatureOverwrite = {
        [feature.name]: {
          value: feature.defaultValue,
        },
      };
      return [feature.name, rawAttributes];
    })
  );
}

/*
function plansToRawPlans(plans: Plans): RawPlans {
  return Object.fromEntries(
    plans.map((plan) => {
      const rawPlan: RawPlan = {
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        currency: plan.currency,
        features:
          plan.features !== null ? featuresToRawFeatures(plan.features) : null,
      };
      return [plan.name, rawPlan];
    })
  );
}
*/

function featuresToRawFeatures(features: Features): FeatureOverwrite {
  return Object.fromEntries(
    features.map((feature) => [
      { [feature.name]: { value: feature.defaultValue } },
    ])
  );
}

/*
export function rawFeatureAttributesToAttributes(
  rawFeatureAttributes: RawFeature
): Features {
  return Object.entries(rawFeatureAttributes).map(
    ([featureName, featureAttributes]) => {
      const feature: FeatureType = {
        name: featureName,
        description: featureAttributes.description,
        expression: featureAttributes.expression,
        serverExpression: featureAttributes.serverExpression,
        valueType: featureAttributes.valueType,
        type: featureAttributes.type,
        defaultValue: featureAttributes.defaultValue,
      };
      return feature;
    }
  );
}
*/

export function rawPlansToPlans(rawPlans: RawPlans): Plans {
  return Object.entries(rawPlans).map(([planName, attributes]) => {
    const plan: Plan = {
      name: planName,
      description: attributes.description,
      monthlyPrice: attributes.monthlyPrice,
      annualPrice: attributes.annualPrice,
      currency: attributes.currency,
      features: attributes.features,
    };
    return plan;
  });
}
