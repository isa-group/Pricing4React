import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { EditorContext } from "../../context/EditorContextProvider";
import { ArrowLeft } from "../../components/Icons";
import { FeatureList } from "../../components/FeatureList";
import { AddOnState, PaymentTypes, StrNumBool } from "../../types";
import { UsageLimitsValues } from "../../components/UsageLimitsValues";

interface AddOnLocation {
  index: number;
}

export function AddOn() {
  const { state } = useLocation();
  const { index } = state as AddOnLocation;
  const isPlanIncluded = index !== null;
  const navigate = useNavigate();
  const goBack = () => navigate("..");

  const {
    attributes,
    usageLimits,
    plans,
    addOns,
    setAddOns,
    pricing: config,
  } = useContext(EditorContext);

  const defaultFeatureValues = attributes.map((feature) => ({
    name: feature.name,
    value: feature.defaultValue,
  }));

  const defaultUsageLimits = usageLimits.map((usageLimit) => ({
    name: usageLimit.name,
    value: usageLimit.defaultValue,
  }));

  const newPlan: AddOnState = {
    name: "",
    description: null,
    availableFor: [""],
    unit: "user/month",
    features: defaultFeatureValues,
    usageLimits: defaultUsageLimits,
    usageLimitsExtensions: defaultUsageLimits,
  };

  const initialAddOn = isPlanIncluded && addOns ? addOns[index] : newPlan;

  const [addOn, setAddOn] = useState<AddOnState>(initialAddOn);
  const [pricing, setPricing] = useState({
    price: 0,
  });

  const handleFeatureChange = (
    featureName: string,
    currentValue: StrNumBool | PaymentTypes
  ) => {
    const feat = addOn.features.map((feature) =>
      feature.name === featureName
        ? { ...feature, value: currentValue }
        : feature
    );
    setAddOn({ ...addOn, features: feat });
  };

  const handleUsageLimitChange = (
    usageLimitName: string,
    currentValue: StrNumBool
  ) => {
    const newUsageLimits = addOn.usageLimits.map((usageLimit) =>
      usageLimit.name === usageLimitName
        ? { ...usageLimit, value: currentValue }
        : usageLimit
    );
    setAddOn({ ...addOn, usageLimits: newUsageLimits });
  };

  const isPlanNameEmpty = addOn.name === "";

  const formHasErrors = isPlanNameEmpty;
  const addPlan = () => {
    if (!addOns) {
      return;
    }

    setAddOns([...addOns, { ...addOn }]);
  };

  const editPlan = (planPosition: number) => {
    if (!addOns) {
      return;
    }

    const newPlans = addOns.map((oldPlan, index) =>
      index === planPosition ? { ...addOn, annualPrice: 0 } : oldPlan
    );
    setAddOns(newPlans);
  };

  const deletePlan = () => {
    if (!addOns) {
      return;
    }
    setAddOns(addOns.filter((_, index) => index !== state.index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formHasErrors) {
      return;
    }

    if (isPlanIncluded) {
      editPlan(index);
    } else {
      addPlan();
    }
    goBack();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAddOn({ ...addOn, [e.target.name]: e.target.value });

  return (
    <article className="pp-content__main">
      <header className="pp-content-header">
        <Button onClick={goBack}>
          <ArrowLeft />
        </Button>
        <h1>{isPlanIncluded && plans ? plans[index].name : "New AddOn"}</h1>
      </header>
      <form className="pp-form" onSubmit={handleSubmit}>
        <div className="pp-form__group">
          {isPlanNameEmpty && (
            <small className="pp-form__errors">Name is required</small>
          )}

          <label htmlFor="name" className="pp-form__label">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="pp-form__field"
            value={addOn.name}
            onChange={handleChange}
          />
        </div>

        {!config?.hasAnnualPayment && (
          <div className="pp-form__group">
            <label htmlFor="price" className="pp-form__label">
              Price
            </label>
            <input
              id="price"
              name="price"
              className="pp-form__field"
              value={pricing.price}
              onChange={handleChange}
            />
          </div>
        )}

        {config?.hasAnnualPayment && (
          <>
            <div className="pp-form__group">
              <label htmlFor="monthlyPrice" className="pp-form__label">
                Monthly Price
              </label>
              <input
                id="monthlyPrice"
                name="monthlyPrice"
                className="pp-form__field"
                value={pricing.price}
                onChange={handleChange}
              />
            </div>
            <div className="pp-form__group">
              <label htmlFor="annualPrice" className="pp-form__label">
                Annual Price
              </label>
              <input
                id="annualPrice"
                name="annualPrice"
                className="pp-form__field"
                value={pricing.price}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <h2>Features</h2>
        <FeatureList
          values={addOn.features}
          onFeatureChange={handleFeatureChange}
        />

        <h2>Usage Limits</h2>
        <UsageLimitsValues
          values={addOn.usageLimits}
          onUsageLimitChange={handleUsageLimitChange}
        />

        <h2>Usage Limits Extensions</h2>
        <UsageLimitsValues
          values={addOn.usageLimitsExtensions}
          onUsageLimitChange={handleUsageLimitChange}
        />

        <div className="pp-plan-actions">
          {isPlanIncluded && (
            <Button
              className="pp-btn"
              style={{ backgroundColor: "red" }}
              type="button"
              onClick={deletePlan}
            >
              Delete
            </Button>
          )}

          <Button className="pp-btn">
            {isPlanIncluded ? "Save changes" : "Add"}
          </Button>
        </div>
      </form>
    </article>
  );
}