import { ChangeEvent, FormEvent, useState } from "react";
import { DefaultValue } from "./DefaultValue";
import { Button } from "../../components/Button";
import { AllFeatures, Type } from "../../types/features";
import { ValueType } from "../../types/index";

interface FeatureFormProps {
  initialData: AllFeatures;
  onValidation: (name: string) => boolean;
  onSubmit: (attribute: AllFeatures) => void;
}

export function FeatureForm({
  initialData,
  onSubmit,
  onValidation,
}: FeatureFormProps) {
  const [attribute, setAttribute] = useState(initialData);
  const [errors, setErrors] = useState({
    nameIsEmpty: false,
    defaultValueIsEmpty: false,
    duplicatedAttribute: false,
  });

  const nameIsEmpty = attribute.name === "";
  const defaultValueIsEmpty = attribute.defaultValue === "";
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  const duplicatedAttribute = onValidation(attribute.name);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!hasErrors) {
      onSubmit(attribute);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttribute({ ...attribute, name: e.target.value });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setAttribute({ ...attribute, description: e.target.value });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (attribute.type) {
      case Type.PAYMENT: {
        setAttribute({
          ...attribute,
          valueType: ValueType.TEXT,
          defaultValue: ["ACH"],
        });
        break;
      }
      case Type.AUTOMATION:
      case Type.DOMAIN:
      case Type.GUARANTEE:
      case Type.INFORMATION:
      case Type.INTEGRATION:
      case Type.MANAGEMENT:
      case Type.SUPPORT: {
        setAttribute({
          ...attribute,
          ...computeType(e.target.value),
        });
      }
    }
  };

  const computeType = (
    type: string
  ):
    | { valueType: ValueType.BOOLEAN; defaultValue: false }
    | { valueType: ValueType.TEXT; defaultValue: "" }
    | { valueType: ValueType.NUMERIC; defaultValue: 0 } => {
    if (type === "BOOLEAN") {
      return { valueType: ValueType.BOOLEAN, defaultValue: false };
    } else if (type === "TEXT") {
      return { valueType: ValueType.TEXT, defaultValue: "" };
    } else {
      return { valueType: ValueType.NUMERIC, defaultValue: 0 };
    }
  };

  return (
    <form className="pp-form" onSubmit={handleSubmit}>
      <div className="pp-form__group">
        {errors.nameIsEmpty ||
          (errors.duplicatedAttribute && (
            <div className="pp-form__errors">
              {errors.nameIsEmpty && (
                <span>
                  Attribute name is <strong>required</strong>{" "}
                </span>
              )}
              {errors.duplicatedAttribute && (
                <span>
                  Cannot add <strong>{attribute.name}</strong>. Attribute name
                  is duplicated
                </span>
              )}
            </div>
          ))}
        <label htmlFor="name" className="pp-form__label">
          Name
        </label>
        <input
          id="name"
          name="name"
          className="pp-form__field"
          value={attribute.name}
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
          value={attribute.description}
          onChange={handleDescriptionChange}
        />
      </div>

      <div>
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={attribute.type}
          onChange={handleTypeChange}
        >
          <option value="NUMERIC">NUMERIC</option>
          <option value="TEXT">TEXT</option>
          <option value="CONDITION">CONDITION</option>
        </select>
      </div>

      <div>
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
        <DefaultValue
          id="default"
          name="default"
          form={attribute}
          setForm={setAttribute}
        />
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