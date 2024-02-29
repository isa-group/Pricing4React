import { Routes, Route, Outlet, useRoutes } from "react-router-dom";
import { RawPricingContext } from "./types";
import { PricingPlansEditor } from "./PricingPlansEditor";
import { AttributesPage } from "./pages/Attributes";
import { UserContextPage } from "./pages/UserContext";
import { EvaluationPage } from "./pages/EvaluationContext";
import { Plan, Plans } from "./pages/Plans";

interface PricingConfigurationRoutesProps {
  pricingContext?: RawPricingContext;
  returnTo: string;
  theme?: string;
  onSave: (pricingContext: RawPricingContext) => void;
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

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <PricingPlansEditor
          theme={theme}
          pricingContext={pricingContext}
          returnTo={returnTo}
          onSave={onSave}
        />
      ),
      children: [
        {
          path: "features",
          element: <AttributesPage />,
        },
        {
          path: "user-context",
          element: (
            <UserContextPage
              title="User context"
              tableHeaders={["Name", "Type", "Actions"]}
            />
          ),
        },
        {
          path: "plans",
          element: <Plans />,
        },
        {
          path: "plans/:planId",
          element: <Plan />,
        },
        {
          path: "evalutation",
          element: <EvaluationPage />,
        },
      ],
    },
  ]);

  return routes;
}
