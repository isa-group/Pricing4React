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

interface TextEvaluationFormProps {
  attribute: FeatureType;
  onSubmit: (name: string, expression: string) => void;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export function TextEvaluationForm({
  attribute,
  onSubmit,
  setVisible,
}: TextEvaluationFormProps) {
  const expression = parseExpression(attribute.expression);

  const [form, setForm] = useState({
    operator: expression.operator,
    userContextValue: expression.userContext,
    customValue: expression.customValue,
  });
  const { userContextAttributes } = useContext(EditorContext);
  const textAttributes = userContextAttributes.filter(
    (attribute) => attribute.type === "TEXT"
  );
  const [custom, setCustom] = useState(false);

  const handleToggleChange = () => {
    setCustom(!custom);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const leftOperand = `planContext['${attribute.name}']`;
    const rightOperand = custom
      ? `'${form.customValue}'`
      : `userContext['${form.userContextValue}']`;

    const expression = computeEvaluation(
      leftOperand,
      form.operator as Operators,
      rightOperand
    );
    onSubmit(attribute.name, expression);
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
          value={form.operator}
          onChange={(e) =>
            setForm({ ...form, operator: e.target.value as Operators })
          }
        >
          <option value="">DON'T EVALUATE</option>
          <option value="==">EQUALS</option>
          <option value="!=">DIFFERENT</option>
        </select>
      </div>
      <div className="pp-field">
        <label id="custom">Use custom value</label>
        <input
          id="custom"
          type="checkbox"
          checked={custom}
          onChange={handleToggleChange}
        />
      </div>
      <div className="pp-field">
        <label id="value-to-compare"></label>
        {!custom && (
          <select
            id="value-to-compare"
            name="value-to-compare"
            value={form.userContextValue}
            onChange={(e) =>
              setForm({ ...form, userContextValue: e.target.value })
            }
          >
            <option value="">Choose an option</option>
            {textAttributes.map((attribute) => (
              <option key={attribute.id} value={attribute.id}>
                {attribute.id}
              </option>
            ))}
          </select>
        )}
        {custom && (
          <input
            id="value-to-compare"
            name="value-to-compare"
            type="text"
            value={form.customValue}
            onChange={(e) => setForm({ ...form, customValue: e.target.value })}
          />
        )}
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
