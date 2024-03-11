import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Button } from "../../components/Button";
import { Operators } from "../../types";
import { computeEvaluation, parseExpression } from "../../utils";
import { EditorContext } from "../../context/EditorContextProvider";
import { FeatureType } from "../../features";

interface ConditionEvaluationFormProps {
  attribute: FeatureType;
  onSubmit: (name: string, expression: string) => void;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export function ConditionEvaluationForm({
  attribute,
  onSubmit,
  setVisible,
}: ConditionEvaluationFormProps) {
  const parsedExpression = parseExpression(attribute.expression);

  const [expression, setExpression] = useState({
    operator: parsedExpression.operator,
    userContextValue: parsedExpression.userContext,
  });
  const { userContextAttributes } = useContext(EditorContext);
  const conditionAttributes = userContextAttributes.filter(
    (attribute) => attribute.type === "BOOLEAN"
  );

  console.log(parsedExpression);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const leftOperand = `planContext['${attribute.name}']`;
    const rightOperand = `userContext['${expression.userContextValue}']`;

    const exp = computeEvaluation(
      leftOperand,
      expression.operator as Operators,
      rightOperand
    );
    onSubmit(attribute.name, exp);
    setVisible(false);
  };

  return (
    <form className="pp-form" onSubmit={handleSubmit}>
      <div className="pp-field">
        <label id="name">Name</label>
        <input id="name" value={attribute.name} readOnly />
      </div>
      <div>
        <label id="operator">Operator</label>
        <select
          id="operator"
          value={expression.operator}
          onChange={(e) =>
            setExpression({
              ...expression,
              operator: e.target.value as Operators,
            })
          }
        >
          <option value="">DON'T EVALUATE</option>
          <option value="&&">AND</option>
          <option value="||">OR</option>
          <option value="None">NONE</option>
        </select>
      </div>

      <div className="pp-field">
        <label id="value-to-compare"></label>
        <select
          id="value-to-compare"
          name="value-to-compare"
          value={expression.userContextValue}
          onChange={(e) =>
            setExpression({ ...expression, userContextValue: e.target.value })
          }
        >
          <option value="">None</option>
          {conditionAttributes.map((attribute) => (
            <option key={attribute.id} value={attribute.id}>
              {attribute.id}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="button"
        className="pp-btn"
        onClick={() => setVisible(false)}
      >
        Close
      </Button>

      <Button className="pp-btn">Save</Button>
    </form>
  );
}
