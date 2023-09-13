import React from "react";
import { Routes, Route } from "react-router-dom";
import { PricingPlansEditor } from "./PricingPlansEditor";
import { AttributesPage } from "./pages/Attributes/AttributesPage";
import { PricingContext } from ".//types";

interface PricingConfigurationRoutesProps {
  pricingContext: PricingContext;
  returnTo: string;
  theme?: string;
  onSave: (pricingContext: PricingContext) => void;
}

export function PricingConfigurationRoutes({
  pricingContext,
  returnTo,
  theme,
  onSave,
}: PricingConfigurationRoutesProps) {
  /**
   * TODO: rgb, rgba and hex validation
   * Following regex detects only rgb rgb\((\d{1,3}),(\d{1,3}),(\d{1,3}\))
   * that outbounds 255
   * Examples:
   * rgb(0,0,0) Valid color pass validation
   * rgb(128,128,128) Valid color pass validation
   * rgb(255,255,255) Valid color pass validation
   * rgb(-1,-1,-1) Invalid color It does not pass validation
   * rgb(256,256,256) Invalid color Pass validtion!!!
   * rgb(999,999,999) Invalid color Pass validation!!!
   * rgb(1000,1000,1000) Invalid color Id does not pass validation
   */

  return (
    <Routes>
      <Route
        element={
          <PricingPlansEditor
            theme={theme}
            pricingContext={pricingContext}
            returnTo={returnTo}
            onSave={onSave}
          />
        }
      >
        <Route index element={<h1>Welcome to Pricing Plans for React</h1>} />
        <Route
          path="attributes"
          element={
            <AttributesPage
              title="Plans attributes"
              tableHeaders={["Name", "Type", "Default", "Actions"]}
              addLabel="Add attribute"
            />
          }
        />
        <Route path="user-context" element={<h1>User Context</h1>} />
        <Route path="plans">
          <Route index element={<h1>Plans</h1>} />
          <Route path=":plan" element={<h1>Specific plan</h1>}></Route>
        </Route>
        <Route path="evaluation" element={<h1>Evaluation Context</h1>} />
      </Route>
    </Routes>
  );
}