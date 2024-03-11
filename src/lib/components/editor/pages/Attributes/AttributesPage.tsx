import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Command } from "../../types";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { Modal } from "../../components/Modal";
import { AttributeForm } from "./AttributeForm";
import { Pencil, Plus, Trash } from "../../components/Icons";
import { EditorContext } from "../../context/EditorContextProvider";
import "./AttributesPage.css";
import {
  AutomationType,
  FeatureOverwrite,
  FeatureType,
  IntegrationType,
  PaymentTypes,
} from "../../features";

const emptyAttribute: FeatureType = {
  name: "",
  description: "",
  valueType: "TEXT",
  defaultValue: "",
  type: "DOMAIN",
  expression: "",
  serverExpression: "",
};

export function AttributesPage() {
  const { plans, setPlans, attributes, setAttributes } =
    useContext(EditorContext);

  const [visible, setvisible] = useState(false);
  const [command, setCommand] = useState("add" as Command);

  const openModal = () => setvisible(true);

  const closeModal = () => setvisible(false);

  const addPlanAttributes = (feature: FeatureType) => {
    const updatedPlans = plans.map((plan) => {
      const updatedFeature: FeatureOverwrite = {
        [feature.name]: { value: feature.defaultValue },
      };
      return {
        ...plan,
        features:
          plan.features === null ? null : { ...plan.features, updatedFeature },
      };
    });
    setPlans(updatedPlans);
  };

  const addAttribute = (feature: FeatureType) => {
    console.log(attributes);
    setAttributes([...attributes, feature]);
    addPlanAttributes(feature);
    closeModal();
  };

  const isAttributeDuplicatedWhenAdding = (name: string) =>
    attributes.filter((feature) => feature.name === name).length !== 0;

  return (
    <article className="pp-content__main">
      <header className="pp-content-header">
        <h1>Plan's attributes</h1>
        <Button
          className="pp-content-header__btn"
          onClick={() => {
            setCommand("add");
            openModal();
          }}
        >
          <Plus />
        </Button>
        <Modal open={visible && command === "add"}>
          <AttributeForm
            initialData={emptyAttribute}
            onSubmit={addAttribute}
            onValidation={isAttributeDuplicatedWhenAdding}
          />
          <Button className="pp-btn" onClick={closeModal}>
            Close
          </Button>
        </Modal>
      </header>

      <Table
        className="pp-table"
        labels={["Name", "Type", "Default", "Actions"]}
      >
        <AttributeList
          command={command}
          setCommand={setCommand}
          isModalVisible={visible}
          setVisible={setvisible}
        />
      </Table>
    </article>
  );
}

interface AttributeListProps {
  command: Command;
  setCommand: Dispatch<SetStateAction<Command>>;
  isModalVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

function AttributeList({
  isModalVisible,
  setVisible,
  command,
  setCommand,
}: AttributeListProps) {
  const { attributes, setAttributes, plans, setPlans } =
    useContext(EditorContext);
  const [position, setPosition] = useState(-1);

  const displayDefaulValueText = (
    defaultValue: string | number | boolean | string[]
  ) => {
    switch (typeof defaultValue) {
      case "string":
      case "number":
        return defaultValue;
      case "boolean": {
        return defaultValue ? "YES" : "NO";
      }
    }
  };

  const duplicatedAttributeWhenEditing = (name: string) =>
    attributes.filter(
      (feature, index) => index !== position && feature.name === name
    ).length !== 0;

  const deleteAttribute = (name: string) => {
    setAttributes(attributes.filter((feature) => feature.name !== name));
    setPlans(
      plans.map((plan) => {
        const newFeatures = null;
        return { ...plan, features: newFeatures };
      })
    );
    setVisible(false);
  };

  const computeNextFeature = (
    previousFeature: FeatureType,
    newFeature: FeatureType
  ): FeatureType => {
    if (
      previousFeature.name !== newFeature.name &&
      previousFeature.type === newFeature.type
    ) {
      return { ...previousFeature, name: newFeature.name };
    }

    if (previousFeature.type !== newFeature.type) {
      return newFeature;
    }
    return previousFeature;
  };

  const editPlanAttributes = (attribute: FeatureType) => {
    const updatedPlans = plans.map((plan) => {
      const oldAttribute = attributes[position];
      return {
        ...plan,
        features: null,
      };
    });
    setPlans(updatedPlans);
  };

  const handleEditAttribute = (newAttribute: FeatureType) => {
    setAttributes((attributes) =>
      attributes.map((previousAttribute, index) => {
        return index === position ? newAttribute : previousAttribute;
      })
    );
    editPlanAttributes(newAttribute);
    setVisible(false);
  };

  return (
    <>
      {attributes.map((attribute, index) => (
        <tr key={attribute.name}>
          <td>{attribute.name}</td>
          <td className={`pp-table-type__${attribute.valueType}`}>
            {attribute.valueType}
          </td>
          <td>{displayDefaulValueText(attribute.defaultValue)}</td>
          <td className="pp-table-actions">
            <Button
              onClick={() => {
                setPosition(index);
                setVisible(true);
                setCommand("edit");
              }}
            >
              <Pencil />
            </Button>
            <Modal
              open={isModalVisible && command === "edit" && position === index}
            >
              <AttributeForm
                initialData={attribute}
                onSubmit={handleEditAttribute}
                onValidation={duplicatedAttributeWhenEditing}
              />
              <Button className="pp-btn" onClick={() => setVisible(false)}>
                Close
              </Button>
            </Modal>

            <Button
              onClick={() => {
                setPosition(index);
                setVisible(true);
                setCommand("delete");
              }}
            >
              <Trash />
            </Button>

            <Modal
              open={
                isModalVisible && command === "delete" && position === index
              }
            >
              <h2>Do you want to delete {attribute.name}?</h2>
              <Button className="pp-btn" onClick={() => setVisible(false)}>
                NO
              </Button>
              <Button
                className="pp-btn"
                onClick={() => deleteAttribute(attribute.name)}
              >
                YES
              </Button>
            </Modal>
          </td>
        </tr>
      ))}
    </>
  );
}
