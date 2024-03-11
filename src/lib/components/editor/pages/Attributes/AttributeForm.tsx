import { ChangeEvent, FormEvent, useState } from "react";
import {
  AutomationType,
  BoolNumberOrString,
  FeatureType,
  IntegrationType,
  PaymentType,
  PaymentTypes,
  Type,
  ValueType,
} from "../../features";
import { DefaultValue } from "./DefaultValue";
import { Button } from "../../components/Button";
import { Entity, Value } from "../../types";

interface AttributeFormProps {
  initialData: FeatureType;
  onValidation: (name: string) => boolean;
  onSubmit: (attribute: FeatureType) => void;
}

type FeatureState = { type: Type } & Entity;

export function AttributeForm({
  initialData,
  onSubmit,
  onValidation,
}: AttributeFormProps) {
  const [feature, setFeature] = useState<FeatureState>({
    name: initialData.name,
    description: initialData.description,
    type: initialData.type,
  });

  const computeInitalState = (): BoolNumberOrString | null => {
    if (initialData.type !== "PAYMENT") {
      switch (initialData.valueType) {
        case "BOOLEAN":
          return {
            valueType: "BOOLEAN",
            defaultValue: initialData.defaultValue,
          };
        case "NUMERIC":
          return {
            valueType: "NUMERIC",
            defaultValue: initialData.defaultValue,
          };
        case "TEXT":
          return { valueType: "TEXT", defaultValue: initialData.defaultValue };
      }
    }

    return null;
  };

  const initialValue = computeInitalState();

  const [value, setValue] = useState<BoolNumberOrString | null>(initialValue);

  const [paymentTypes, setPaymentTypes] = useState<PaymentTypes>(
    initialData.type === "PAYMENT" ? initialData.defaultValue : []
  );
  const [docUrl, setDocUrl] = useState(
    initialData.type === "GUARANTEE" ? initialData.docUrl : ""
  );
  const [integrationType, setIntegrationType] = useState<IntegrationType>(
    initialData.type === "INTEGRATION" ? initialData.integrationType : "API"
  );
  const [automationType, setAutomationType] = useState<AutomationType>(
    initialData.type === "AUTOMATION" ? initialData.automationType : "BOT"
  );

  const [errors, setErrors] = useState({
    nameIsEmpty: false,
    defaultValueIsEmpty: false,
    duplicatedAttribute: false,
  });

  const nameIsEmpty = feature.name === "";
  const duplicatedAttribute = onValidation(feature.name);
  const nameFieldHasErrors = nameIsEmpty || duplicatedAttribute;
  const defaultValueIsEmpty =
    value?.defaultValue === "" || paymentTypes.length === 0;
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!hasErrors) {
      switch (feature.type) {
        case "PAYMENT": {
          onSubmit({
            name: feature.name,
            description: feature.description,
            defaultValue: paymentTypes,
            valueType: "TEXT",
            type: feature.type,
            expression: initialData.expression,
            serverExpression: initialData.serverExpression,
          });
          break;
        }

        case "AUTOMATION": {
          switch (value?.valueType) {
            case "BOOLEAN": {
              onSubmit({
                ...feature,
                type: "AUTOMATION",
                automationType: automationType,
                valueType: "BOOLEAN",
                defaultValue: value.defaultValue,
                expression: initialData.expression,
                serverExpression: initialData.serverExpression,
              });
              break;
            }
            case "NUMERIC": {
              onSubmit({
                ...feature,
                type: "AUTOMATION",
                automationType: automationType,
                valueType: "NUMERIC",
                defaultValue: value.defaultValue,
                expression: initialData.expression,
                serverExpression: initialData.serverExpression,
              });
              break;
            }
            case "TEXT": {
              onSubmit({
                ...feature,
                type: "AUTOMATION",
                automationType: automationType,
                valueType: "TEXT",
                defaultValue: value.defaultValue,
                expression: initialData.expression,
                serverExpression: initialData.serverExpression,
              });
            }
          }

          break;
        }
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeature({ ...feature, name: e.target.value });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFeature({ ...feature, description: e.target.value });

  const handleFeatureTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFeature({ ...feature, type: e.target.value as Type });

  const handleValueTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value as ValueType) {
      case "BOOLEAN":
        return setValue({ valueType: "BOOLEAN", defaultValue: false });
      case "NUMERIC":
        return setValue({ valueType: "NUMERIC", defaultValue: 0 });
      case "TEXT":
        return setValue({ valueType: "TEXT", defaultValue: "" });
    }
  };

  const handleIntegrationTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setIntegrationType(e.target.value as IntegrationType);

  const handlePaymentOptionsChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const { options } = event.target;
    const selectedOptions: PaymentTypes = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedOptions.push(options[i].value as PaymentType);
      }
    }
    setPaymentTypes(selectedOptions);
  };

  const handleAutomationTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setAutomationType(e.target.value as AutomationType);

  return (
    <form className="pp-form" onSubmit={handleSubmit}>
      <div className="pp-form__group">
        {nameFieldHasErrors && (
          <div className="pp-form__errors">
            {errors.nameIsEmpty && (
              <span>
                Attribute name is <strong>required</strong>
              </span>
            )}
            {errors.duplicatedAttribute && (
              <span>
                Cannot add <strong>{feature.name}</strong>. Attribute name is
                duplicated
              </span>
            )}
          </div>
        )}
        <label htmlFor="name" className="pp-form__label">
          Name
        </label>
        <input
          id="name"
          name="name"
          className="pp-form__field"
          value={feature.name}
          onChange={handleNameChange}
        />
      </div>
      <div className="pp-form__group">
        <label htmlFor="description" className="pp-form__label">
          Description
        </label>
        <input
          id="description"
          name="description"
          className="pp-form__field"
          value={feature.description}
          onChange={handleDescriptionChange}
        />
      </div>

      <div className="pp-form__group">
        <label htmlFor="type">Feature type</label>
        <select
          id="type"
          name="type"
          value={feature.type}
          onChange={handleFeatureTypeChange}
        >
          <option value="AUTOMATION">AUTOMATION</option>
          <option value="DOMAIN">DOMAIN</option>
          <option value="GUARANTEE">GUARANTEE</option>
          <option value="INFORMATION">INFORMATION</option>
          <option value="INTEGRATION">INTEGRATION</option>
          <option value="MANAGEMENT">MANAGEMENT</option>
          <option value="PAYMENT">PAYMENT</option>
          <option value="SUPPORT">SUPPORT</option>
        </select>
      </div>

      {feature.type === "AUTOMATION" && (
        <div className="pp-form__group">
          <label htmlFor="automationType" className="pp-form__label">
            Automation type
          </label>
          <select
            id="automationType"
            name="automationType"
            value={automationType}
            onChange={handleAutomationTypeChange}
          >
            <option value="BOT">BOT</option>
            <option value="FILTERING">FILTERING</option>
            <option value="TRACKING">TRACKING</option>
            <option value="TASK_AUTOMATION">TASK AUTOMATION</option>
          </select>
        </div>
      )}

      {feature.type === "GUARANTEE" && (
        <div className="pp-form__group">
          <label htmlFor="docUrl" className="pp-form__label">
            Documentation URL
          </label>
          <input
            id="docUrl"
            name="docUrl"
            className="pp-form__field"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
          />
        </div>
      )}

      {feature.type === "INTEGRATION" && (
        <div className="pp-form__group">
          <label htmlFor="integrationType" className="pp-form__label">
            Integration type
          </label>
          <select
            id="integrationType"
            name="integrationType"
            value={integrationType}
            onChange={handleIntegrationTypeChange}
          >
            <option value="API">API</option>
            <option value="EXTENSION">EXTENSION</option>
            <option value="EXTERNAL_DEVICE">EXTERNAL DEVICE</option>
            <option value="IDENTITY_PROVIDER">IDENTITY PROVIDER</option>
            <option value="MARKETPLACE">MARKETPLACE</option>
            <option value="WEB_SAAS">WEB SAAS</option>
          </select>
        </div>
      )}

      <div className="pp-form__group">
        <label htmlFor="valueType">Value type</label>
        {feature.type !== "PAYMENT" && value !== null ? (
          <select
            id="valueType"
            name="valueType"
            value={value.valueType}
            onChange={handleValueTypeChange}
          >
            <option value="NUMERIC">NUMERIC</option>
            <option value="TEXT">TEXT</option>
            <option value="BOOLEAN">BOOLEAN</option>
          </select>
        ) : (
          <input
            id="type"
            name="type"
            disabled={true}
            readOnly
            defaultValue="TEXT"
          />
        )}
      </div>

      <div className="pp-form__group">
        {hasErrors && (
          <div className="pp-form__errors">
            {errors.defaultValueIsEmpty && (
              <span>
                Attribute default value is <strong>required</strong>
              </span>
            )}
          </div>
        )}
        <label htmlFor="default">Default value</label>

        {feature.type === "PAYMENT" ? (
          <select
            id="default"
            name="default"
            multiple={true}
            value={paymentTypes}
            onChange={handlePaymentOptionsChange}
          >
            <option value="ACH">ACH</option>
            <option value="CARD">CARD</option>
            <option value="GATEWAY">GATEWAY</option>
            <option value="INVOICE">INVOICE</option>
            <option value="WIRE_TRANSFER">INVOICE</option>
            <option value="OTHER">OTHER</option>
          </select>
        ) : (
          <DefaultValue
            id="default"
            name="default"
            value={value as BoolNumberOrString}
            setValue={setValue}
          />
        )}
      </div>

      <Button
        className="pp-btn"
        onClick={() =>
          setErrors({ nameIsEmpty, defaultValueIsEmpty, duplicatedAttribute })
        }
      >
        Save
      </Button>
    </form>
  );
}
