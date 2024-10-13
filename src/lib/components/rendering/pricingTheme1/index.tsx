import { AddOn, Plan, Pricing, PricingData } from "../../../../types";
import {
  formatPricingComponentName,
  getPricingData,
  pluralizeUnit,
} from "../../../../services/pricing.service";
import { useState } from "react";

import "./styles.css";

type BilledType = "monthly" | "annually";

interface RenderingStyles {
  plansColor?: string;
  priceColor?: string;
  periodColor?: string;
  headerColor?: string;
  namesColor?: string;
  valuesColor?: string;
  checkColor?: string;
  crossColor?: string;
  backgroundColor?: string;
  dividerColor?: string;
  billingSelectionColor?: string;
  billingSelectionBackgroundColor?: string;
  billingSelectionTextColor?: string;
  addonBackgroundColor?: string;
  addonTextColor?: string;
}

interface PricingProps {
  pricing: Pricing;
  style: RenderingStyles;
}

const DEFAULT_STYLES: RenderingStyles = {
  plansColor: "#000000",
  priceColor: "#000000",
  periodColor: "#000000",
  headerColor: "#000000",
  namesColor: "#000000",
  valuesColor: "#000000",
  checkColor: "#000000",
  crossColor: "#000000",
  backgroundColor: "#f3f4f6",
  dividerColor: "#000000",
  billingSelectionColor: "#ffffff",
  billingSelectionBackgroundColor: "#EEE",
  billingSelectionTextColor: "#000000",
  addonBackgroundColor: "#ffffff",
  addonTextColor: "#000000",
};

function SelectOfferTab({
  selectedBilledType,
  handleSwitchTab,
  style,
}: Readonly<{
  selectedBilledType: BilledType;
  handleSwitchTab: (tab: BilledType) => void;
  style: RenderingStyles;
}>): JSX.Element {
  return (
    <div
      className="radio-inputs"
      style={{
        backgroundColor:
          style.billingSelectionBackgroundColor ??
          DEFAULT_STYLES.billingSelectionBackgroundColor,
      }}
    >
      <label className="radio">
        <input
          type="radio"
          name="radio"
          onClick={() => handleSwitchTab("monthly")}
          checked={selectedBilledType === "monthly"}
        />
        <span
          className="name"
          style={{
            color:
              style.billingSelectionTextColor ??
              DEFAULT_STYLES.billingSelectionTextColor,
            backgroundColor:
              selectedBilledType === "monthly"
                ? style.billingSelectionColor ??
                  DEFAULT_STYLES.billingSelectionColor
                : "transparent",
          }}
        >
          Monthly
        </span>
      </label>
      <label className="radio">
        <input
          type="radio"
          name="radio"
          onClick={() => handleSwitchTab("annually")}
          checked={selectedBilledType === "annually"}
        />
        <span
          className="name"
          style={{
            color:
              style.billingSelectionTextColor ??
              DEFAULT_STYLES.billingSelectionTextColor,
            backgroundColor:
              selectedBilledType === "annually"
                ? style.billingSelectionColor ??
                  DEFAULT_STYLES.billingSelectionColor
                : "transparent",
          }}
        >
          Annually
        </span>
      </label>
    </div>
  );
}

function PlanHeader({
  plan,
  currency,
  selectedBilledType,
  style,
}: Readonly<{
  plan: Plan;
  currency: string;
  selectedBilledType: BilledType;
  style: RenderingStyles;
}>): JSX.Element {
  return (
    <th scope="col" className="plan-col">
      <h2
        className="plan-heading"
        style={{ color: style.plansColor ?? DEFAULT_STYLES.plansColor }}
      >
        {plan.name}
      </h2>
      <p className="plan-price-container">
        <span
          className="plan-price"
          style={{ color: style.priceColor ?? DEFAULT_STYLES.priceColor }}
        >
          {(() => {
            if (selectedBilledType === "monthly") {
              return plan.monthlyPrice === 0 ? "FREE" : plan.monthlyPrice;
            } else {
              return plan.annualPrice === 0 ? "FREE" : plan.annualPrice;
            }
          })()}
          {(() => {
            const price = selectedBilledType === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            return price === 0 ? "" : currency;
          })()}
        </span>
        <span
          className="plan-period"
          style={{ color: style.periodColor ?? DEFAULT_STYLES.periodColor }}
        >
          {(() => {
            let period = "";
            if (selectedBilledType === "monthly") {
              period = plan.monthlyPrice === 0 ? "" : "/month";
            } else {
              period = plan.annualPrice === 0 ? "" : "/month";
            }
            return period;
          })()}
        </span>
      </p>
    </th>
  );
}

function PricingElement({
  name,
  values,
  style,
}: Readonly<{
  name: string;
  values: { value: string | number | boolean; unit?: string }[];
  style: RenderingStyles;
}>): JSX.Element {
  return (
    <tr>
      <th
        scope="row"
        className="row-header divide-y"
        style={{
          borderTopColor: style.dividerColor ?? DEFAULT_STYLES.dividerColor,
        }}
      >
        <h3 style={{ color: style.namesColor ?? DEFAULT_STYLES.namesColor }}>
          {name}
        </h3>
      </th>
      {values.map(({ value, unit }, key) => {
        if (typeof value === "boolean") {
          return (
            <td
              className="divide-y"
              style={{
                borderTopColor:
                  style.dividerColor ?? DEFAULT_STYLES.dividerColor,
              }}
              key={`${name}-${key}`}
            >
              {value ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-label="Included"
                  className="icon-check"
                  style={{
                    color: style.checkColor ?? DEFAULT_STYLES.checkColor,
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-label="Not included"
                  className="icon-cross"
                  style={{
                    color: style.crossColor ?? DEFAULT_STYLES.crossColor,
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </td>
          );
        } else {
          return (
            <td
              className="divide-y"
              style={{
                borderTopColor:
                  style.dividerColor ?? DEFAULT_STYLES.dividerColor,
              }}
              key={`${name}-${key}`}
            >
              <span
                className="text-value"
                style={{
                  color: style.valuesColor ?? DEFAULT_STYLES.valuesColor,
                }}
              >
                {(() => {
                  if (typeof value === "number") {
                    return value === 0
                      ? "-"
                      : `${value} ${
                          value > 1 ? pluralizeUnit(unit ?? "") : unit
                        }`;
                  }
                  return value;
                })()}
              </span>
            </td>
          );
        }
      })}
    </tr>
  );
}

function AddOnElement({
  addOn,
  currency,
  selectedBilledType,
  style,
}: Readonly<{
  addOn: AddOn;
  currency: string;
  selectedBilledType: BilledType;
  style: RenderingStyles;
}>): JSX.Element {
  return (
    <div className="add-on-element-container">
      <span className="add-on-title" style={{color: style.addonTextColor ?? DEFAULT_STYLES.addonTextColor}}>{formatPricingComponentName(addOn.name)}</span>
      <p className="plan-price-container" style={{backgroundColor: style.addonBackgroundColor ?? DEFAULT_STYLES.addonBackgroundColor}}>
        <span
          className="plan-price"
          style={{ color: style.priceColor ?? DEFAULT_STYLES.priceColor }}
        >
          {addOn.monthlyPrice ?
            selectedBilledType === "monthly"
              ? addOn.monthlyPrice
              : addOn.annualPrice
            :
            addOn.price
            
          }
          {currency}
        </span>
        <span
          className="plan-period"
          style={{ color: style.periodColor ?? DEFAULT_STYLES.periodColor }}
        >
          /{addOn.unit}
        </span>
      </p>
    </div>
  );
}

const CopyButton = ({pricing}: {pricing: Pricing}) => {
  // Función para copiar el texto al portapapeles
  const copyToClipboard = () => {
    const textToCopy = JSON.stringify(pricing, null, 2);
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Pricing copied to clipboard');
      })
      .catch((err) => {
        console.error('Error copying the texto to clipboard ', err);
      });
  };

  return (
    <button onClick={copyToClipboard} className="export-button">
      Export Pricing
    </button>
  );
};

export function PricingTheme1({
  pricing,
  style,
}: Readonly<PricingProps>): JSX.Element {
  let pricingData: PricingData = getPricingData(pricing);

  if (!style) {
    style = {};
  }

  const [selectedBilledType, setSelectedBilledType] =
    useState<BilledType>("monthly");
  function handleSwitchTab(tab: BilledType) {
    setSelectedBilledType(tab);
  }

  return (
    <section
      style={{
        backgroundColor:
          style.backgroundColor ?? DEFAULT_STYLES.backgroundColor,
      }}
    >
      <div style={{display: "flex", justifyContent: "center", width: "100%", marginBottom: "30px", paddingTop: "50px"}}>
        <CopyButton pricing={pricing} />
      </div>
      <div className="container">
        {/* <div className="pricing-page-title">
          <h1
            style={{ color: style.headerColor ?? DEFAULT_STYLES.headerColor }}
          >
            {pricing.name.charAt(0).toUpperCase() + pricing.name.slice(1)}{" "}
            Pricing
          </h1>
        </div> */}
        {pricing.hasAnnualPayment && (
          <div className="pricing-page-title">
            <SelectOfferTab
              handleSwitchTab={handleSwitchTab}
              selectedBilledType={selectedBilledType}
              style={style}
            />
          </div>
        )}
        <table className="pricing-table">
          <thead>
            <tr>
              <th></th>
              {pricing.plans.map((plan: Plan, key: number) => (
                <PlanHeader
                  plan={plan}
                  currency={pricing.currency}
                  selectedBilledType={selectedBilledType}
                  style={style}
                  key={`${plan.name}-${key}`}
                />
              ))}
            </tr>
          </thead>
          <tbody className="pricing-body">
            {Object.entries(pricingData).map(
              (
                [name, values]: [
                  string,
                  { value: string | number | boolean; unit?: string }[]
                ],
                key: number
              ) => (
                <PricingElement
                  name={name}
                  values={values}
                  style={style}
                  key={`${name}-${key}`}
                />
              )
            )}
          </tbody>
        </table>
        {pricing.addOns && (
          <>
            <div className="pricing-page-title" style={{color: style.headerColor ?? DEFAULT_STYLES.headerColor}}>
              <h1>Add-Ons</h1>
            </div>
            <div className="add-ons-container">
              {pricing.addOns.map((addOn) => {
                return <AddOnElement addOn={addOn} currency={pricing.currency} selectedBilledType={selectedBilledType} style={style}/>;
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
