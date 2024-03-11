import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Plans, RawPricingContext, UserContextAttributes } from "../types";
import {
  parseAttributeExpressionToUserAttributes,
  rawPlansToPlans,
} from "../utils";
import { Features } from "../features";

interface EditorContextProps {
  attributes: Features;
  setAttributes: Dispatch<SetStateAction<Features>>;
  userContextAttributes: UserContextAttributes;
  setUserContextAttributes: Dispatch<SetStateAction<UserContextAttributes>>;
  plans: Plans;
  setPlans: Dispatch<SetStateAction<Plans>>;
  theme: string;
  returnTo: string;
}

export const EditorContext = createContext<EditorContextProps>({
  theme: "blue",
  returnTo: "/",
  attributes: [] as Features,
  setAttributes: () => null,
  userContextAttributes: [] as UserContextAttributes,
  setUserContextAttributes: () => null,
  plans: [] as Plans,
  setPlans: () => null,
});

interface EditorContextProviderProps {
  pricingContext?: RawPricingContext;
  theme?: string;
  returnTo?: string;
  children: JSX.Element | JSX.Element[];
}

export function EditorContextProvider({
  pricingContext,
  theme,
  returnTo,
  children,
}: EditorContextProviderProps) {
  const editorTheme = theme ? theme : "blue";
  const retTo = returnTo ? returnTo : "/";
  const features: Features = [];

  const initialPlans =
    pricingContext && pricingContext.plans
      ? rawPlansToPlans(pricingContext.plans)
      : [];

  const initialUserAttributes = parseAttributeExpressionToUserAttributes(
    features
  ).filter((userAttribute) => userAttribute.id !== "");
  const [attributes, setAttributes] = useState(features as Features);
  const [userContextAttributes, setUserContextAttributes] = useState(
    initialUserAttributes
  );
  const [plans, setPlans] = useState(initialPlans);
  return (
    <EditorContext.Provider
      value={{
        attributes,
        setAttributes,
        userContextAttributes,
        setUserContextAttributes,
        plans,
        setPlans,
        theme: editorTheme,
        returnTo: retTo,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
