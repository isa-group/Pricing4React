import { useContext, useState } from "react";
import { Command } from "../../parsers/expression";
import { EditorContext } from "../../context/EditorContextProvider";
import { Button } from "../../components/Button";
import { Pencil, Trash } from "../../components/Icons";
import { TextEvaluationForm } from "./TextEvaluationForm";
import { NumericEvaluationForm } from "./NumericEvaluationForm";
import { ConditionEvaluationForm } from "./ConditionEvaluationForm";
import { Modal } from "../../components/Modal";
import { ValueType } from "../../types/index";
import { AllFeatures } from "../../types/features";
import { useToggle } from "../../hooks";

export function EvaluationList() {
  const { attributes, setAttributes } = useContext(EditorContext);
  const [position, setPosition] = useState(-1);
  const { visible, on: openModal, off: closeModal } = useToggle();
  const [command, setCommand] = useState("edit" as Command);

  const updateEvaluation = (name: string, expression: string) =>
    setAttributes(
      attributes.map((attribute) => {
        const updatedAttribute: AllFeatures = { ...attribute, expression };
        return attribute.name === name ? updatedAttribute : attribute;
      })
    );

  const deleteEvaluation = (name: string) => {
    setAttributes(
      attributes.map((attribute) =>
        attribute.name === name ? { ...attribute, expression: "" } : attribute
      )
    );
    closeModal();
  };

  return (
    <>
      {attributes.map((attribute, index) => (
        <tr key={attribute.name}>
          <td>{attribute.name}</td>
          <td className={`pp-table-type__${attribute.type}`}>
            {attribute.type}
          </td>
          <td className="expression">
            {attribute.expression === "" ? "NOT EVALUATED" : "EVALUATED"}
          </td>
          <td className="pp-table-actions">
            <Button
              onClick={() => {
                setCommand("edit");
                openModal();
                setPosition(index);
              }}
            >
              <Pencil />
            </Button>
            <Modal open={visible && command === "edit" && position === index}>
              <>
                {attribute.valueType === ValueType.Text && (
                  <TextEvaluationForm
                    attribute={attribute}
                    onSubmit={updateEvaluation}
                    closeModal={closeModal}
                  />
                )}
                {attribute.valueType === ValueType.Numeric && (
                  <NumericEvaluationForm
                    attribute={attribute}
                    onSubmit={updateEvaluation}
                    closeModal={closeModal}
                  />
                )}
                {attribute.valueType === ValueType.Boolean && (
                  <ConditionEvaluationForm
                    attribute={attribute}
                    onSubmit={updateEvaluation}
                    closeModal={closeModal}
                  />
                )}
              </>
            </Modal>

            <Button
              onClick={() => {
                openModal();
                setCommand("delete");
                setPosition(index);
              }}
            >
              <Trash />
            </Button>
            <Modal open={visible && command === "delete" && position === index}>
              <h2>
                This action will stop evaluating {attribute.name}. Are you sure?
              </h2>
              <Button className="pp-btn" onClick={closeModal}>
                NO
              </Button>
              <Button
                className="pp-btn"
                onClick={() => deleteEvaluation(attribute.name)}
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
