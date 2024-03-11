import { Dispatch, SetStateAction } from "react";
import { BoolNumberOrString } from "../../features";

interface DefaultValueProps {
  id: string;
  name: string;
  value: BoolNumberOrString;
  setValue: Dispatch<SetStateAction<BoolNumberOrString | null>>;
}

export function DefaultValue({ id, name, value, setValue }: DefaultValueProps) {
  console.log(value.valueType);
  switch (value.valueType) {
    case "TEXT": {
      return (
        <input
          id={id}
          name={name}
          type="text"
          value={value.defaultValue}
          onChange={(e) =>
            setValue({
              valueType: "TEXT",
              defaultValue: e.target.value,
            })
          }
        />
      );
    }
    case "NUMERIC":
      return (
        <input
          id={id}
          name={name}
          type="number"
          value={value.defaultValue}
          onChange={(e) =>
            setValue({
              valueType: "NUMERIC",
              defaultValue: e.target.valueAsNumber,
            })
          }
        />
      );
    case "BOOLEAN":
      return (
        <select
          id={id}
          name={name}
          value={value.defaultValue ? "true" : "false"}
          onChange={(e) =>
            setValue({
              valueType: "BOOLEAN",
              defaultValue: e.target.value === "true" ? true : false,
            })
          }
        >
          <option value="">Choose an option</option>
          <option value="true">YES</option>
          <option value="false">NO</option>
        </select>
      );
  }
}
