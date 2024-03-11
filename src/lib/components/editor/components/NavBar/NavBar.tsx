import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../Button";
import { EditorContext } from "../../context/EditorContextProvider";
import { RawPricingContext } from "../../types";
//import { buildRawPricingContext } from "../../utils";
import "./NavBar.css";

interface NavBarProps {
  hidden: boolean;
  onSave: (pricingContext: RawPricingContext) => void;
}

export function NavBar({ hidden, onSave }: NavBarProps) {
  const { attributes, plans, returnTo } = useContext(EditorContext);
  //const rawPricingContext = buildRawPricingContext(attributes, plans);

  const computeNavLinkStatus = ({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) => {
    if (isPending) {
      return "pp-link --is-pending";
    } else {
      if (isActive) {
        return "pp-link --is-active";
      } else {
        return "pp-link";
      }
    }
  };

  return (
    <nav className="pp-nav" hidden={hidden}>
      <img
        className="pp-logo"
        src="https://placehold.co/200x100?text=pricingplans-react"
      />
      <ul className="pp-nav-items">
        <li>
          <NavLink className={computeNavLinkStatus} to="features">
            Attributes
          </NavLink>
        </li>
        <li>
          <NavLink className={computeNavLinkStatus} to="user-context">
            User Context
          </NavLink>
        </li>
        <li>
          <NavLink className={computeNavLinkStatus} to="plans">
            Pricing plans
          </NavLink>
        </li>
        <li>
          <NavLink className={computeNavLinkStatus} to="evaluation">
            Evaluation
          </NavLink>
        </li>
        <li>
          <NavLink className={computeNavLinkStatus} to={returnTo}>
            Return to page
          </NavLink>
        </li>
      </ul>
      {/*<Button className="pp-btn" onClick={() => onSave(rawPricingContext)}>
        Save
      </Button>*/}
    </nav>
  );
}
