import { ChangeEvent, FormEvent, useState } from "react";
import { UserContextAttribute } from "../../types";
import { Button } from "../../components/Button";
import { ValueType } from "../../features";

interface UserContextFormProps {
  initialData: UserContextAttribute;
  onSubmit: (attribute: UserContextAttribute) => void;
}

export function UserContextForm({
  initialData,
  onSubmit,
}: UserContextFormProps) {
  const [userAttribute, setUserAttribute] = useState(initialData);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit(userAttribute);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserAttribute({ ...userAttribute, id: e.target.value });
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserAttribute({
      ...userAttribute,
      type: e.target.value as ValueType,
    });

  return (
    <form className="pp-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        value={userAttribute.id}
        onChange={handleNameChange}
      />
      <label htmlFor="type">Type</label>
      <select
        id="type"
        name="type"
        value={userAttribute.type}
        onChange={handleTypeChange}
      >
        <option value="NUMERIC">NUMERIC</option>
        <option value="TEXT">TEXT</option>
        <option value="CONDITION">CONDITION</option>
      </select>
      <Button className="pp-btn">Save</Button>
    </form>
  );
}
