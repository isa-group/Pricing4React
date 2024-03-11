import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PricingConfigurationRoutes } from "./PricingConfigurationRoutes";
import { PricingContext, RawPlans, RawPricingContext } from "./types";
import { RawFeatureAttributes, RawFeatures } from "./features";

const features: RawFeatures = {
  allowGameSpectators: {
    description: "Max games limit per user in the clinic",
    expression: "planContext['allowGameSpectators']",
    serverExpression: "planContext['maxPets'] >= userContext['pets']",
    valueType: "BOOLEAN",
    type: "DOMAIN",
    defaultValue: false,
  },
  maxGames: {
    description: "Maximun games",
    expression: "planContext['maxGames'] > userContext['games']",
    serverExpression:
      "planContext['maxVisitsPerMonthAndPet'] >= userContext['visitsPerMonth']",
    valueType: "NUMERIC",
    type: "DOMAIN",
    defaultValue: 5,
  },
};
const plans: RawPlans = {
  BASIC: {
    description: "Plan for basic users",
    monthlyPrice: 0,
    annualPrice: 0,
    currency: "EUR",
    features: {
      maxGames: {
        value: 2,
      },
      allowGameSpectators: {
        value: false,
      },
    },
  },
  ADVANCED: {
    description: "Plan for advanced users",
    monthlyPrice: 9.99,
    annualPrice: 9.99,
    currency: "EUR",
    features: {
      maxGames: {
        value: 25,
      },
      allowGameSpectators: {
        value: true,
      },
    },
  },
  PRO: {
    description: "Plan for pro users",
    monthlyPrice: 14.99,
    annualPrice: 14.99,
    currency: "EUR",
    features: {
      maxGames: {
        value: 100,
      },
      allowGameSpectators: {
        value: true,
      },
    },
  },
};

const pricingContext: RawPricingContext = {
  saasName: "Test",
  date: new Date(),
  currency: "EUR",
  hasAnnualPayment: false,
  features,
  plans,
};

const onSave = (pricingContext: RawPricingContext) =>
  console.log(pricingContext);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PricingConfigurationRoutes
        pricingContext={pricingContext}
        returnTo="/"
        onSave={onSave}
      />
    </BrowserRouter>
  </React.StrictMode>
);
