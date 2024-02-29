import { useState } from "react";
import { Outlet } from "react-router-dom";
import { EditorContextProvider } from "./context/EditorContextProvider";
import { Toggle } from "./components/Toggle";
import { NavBar } from "./components/NavBar";
import { RawPricingContext } from "./types";
import "./Form.css";
import "./PricingPlansEditor.css";

interface PricingPlansEditorProps {
  pricingContext?: RawPricingContext;
  returnTo: string;
  theme?: string;
  onSave: (pricingContext: RawPricingContext) => void;
}

export function PricingPlansEditor({
  theme,
  pricingContext,
  returnTo,
  onSave,
}: PricingPlansEditorProps) {
  const [hidden, setHidden] = useState(false);

  const handleClick = () => {
    setHidden(!hidden);
  };

  return (
    <EditorContextProvider
      pricingContext={pricingContext}
      theme={theme}
      returnTo={returnTo}
    >
      <div className="pp-editor">
        <NavBar hidden={hidden} onSave={onSave} />
        <main className="pp-content">
          <Toggle
            className="pp-toggle pp-content__toggle"
            isHidden={hidden}
            onClick={handleClick}
          />
          <Outlet />
        </main>
      </div>
    </EditorContextProvider>
  );
}
