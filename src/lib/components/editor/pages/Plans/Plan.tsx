// import {
//   ChangeEvent,
//   Dispatch,
//   FormEvent,
//   SetStateAction,
//   useContext,
//   useState,
// } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {  Plan, Plans } from "../../types";
// import { Button } from "../../components/Button";
// import { EditorContext } from "../../context/EditorContextProvider";
// import { ArrowLeft } from "../../components/Icons";
// import { computeValueType } from "../../utils";
// import { Features } from "../../features";

// interface PlanLocation {
//   index: number;
// }

// interface PlanState {
//   name: string;
//   description: string;
//   price: string;
//   currency: string;
// }

// export function Plan() {
//   const { state } = useLocation();
//   const { index } = state as PlanLocation;
//   const isPlanIncluded = index !== null;
//   const navigate = useNavigate();
//   const goBack = () => navigate("..");

//   const { attributes, plans, setPlans } = useContext(EditorContext);

//   const initialFeatures = isPlanIncluded
//     ? plans[index].features
//     : attributes.map((attribute) => ({
//         name: attribute.name,
//         type: computeValueType(attribute.defaultValue),
//         value: attribute.defaultValue,
//       }));

//   const initialPlan = isPlanIncluded
//     ? {
//         name: plans[state.index].name,
//         description: plans[state.index].description,
//         price: plans[state.index].monthlyPrice.toString(),
//         currency: plans[state.index].currency,
//       }
//     : {
//         name: "",
//         description: "",
//         price: "",
//         currency: "",
//       };

//   const [plan, setPlan] = useState<PlanState>(initialPlan);
//   const [features, setFeatures] = useState<Features>(initialFeatures);

//   const isPlanNameEmpty = plan.name === "";
//   const isPlanNameCompound = plan.name.trim().split(" ").length > 1;
//   const priceRegex = /^\d+.?\d{0,2}?$/;
//   const isValidPrice = priceRegex.test(plan.price);

//   const addPlan = () =>
//     setPlans([...plans, { ...plan, monthlyPrice: Number(plan.price), features }]);

//   const editPlan = (planPosition: number) => {
//     const newPlans: Plans = plans.map((oldPlan, index) =>
//       index === planPosition
//         ? { ...plan, price: Number(plan.price), features }
//         : oldPlan
//     );
//     setPlans(newPlans);
//   };

//   const deletePlan = () => {
//     setPlans(plans.filter((_, index) => index !== state.index));
//     goBack();
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     if (isPlanIncluded) {
//       editPlan(index);
//     } else {
//       addPlan();
//     }
//     goBack();
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
//     setPlan({ ...plan, [e.target.name]: e.target.value });

//   return (
//     <article className="pp-content__main">
//       <header className="pp-content-header">
//         <Button onClick={goBack}>
//           <ArrowLeft />
//         </Button>
//         <h1>{isPlanIncluded ? plans[index].name : "New Plan"}</h1>
//       </header>
//       <form className="pp-form" onSubmit={handleSubmit}>
//         <div className="pp-form__group">
//           {isPlanNameEmpty && <small>Plan name is required</small>}
//           {isPlanNameCompound && (
//             <small>
//               Compound plan names are not allowed. Use only one word
//             </small>
//           )}
//           <label htmlFor="name" className="pp-form__label">
//             Plan name
//           </label>
//           <input
//             id="name"
//             name="name"
//             className="pp-form__field"
//             value={plan.name}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="pp-form__group">
//           <label htmlFor="description" className="pp-form__label">
//             Description
//           </label>
//           <input
//             id="description"
//             name="description"
//             className="pp-form__field"
//             value={plan.description}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="pp-form__group">
//           {!isValidPrice && (
//             <small>
//               Invalid price. Plan has to be zero or positive and contain a dot
//             </small>
//           )}
//           <label htmlFor="price" className="pp-form__label">
//             Price
//           </label>
//           <input
//             id="price"
//             name="price"
//             type="number"
//             className="pp-form__field"
//             value={plan.price}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="pp-form__group">
//           <label htmlFor="currency" className="pp-form__label">
//             Currency
//           </label>
//           <input
//             id="currency"
//             name="currency"
//             className="pp-form__field"
//             value={plan.currency}
//             onChange={handleChange}
//           />
//         </div>
//         <FeatureList features={features} setFeatures={setFeatures} />
//         <footer className="pp-plan-actions">
//           {isPlanIncluded && (
//             <Button
//               className="pp-btn"
//               style={{ backgroundColor: "red" }}
//               type="button"
//               onClick={deletePlan}
//             >
//               Delete plan
//             </Button>
//           )}
//           <Button className="pp-btn">
//             {isPlanIncluded ? "Save changes" : "Add plan"}
//           </Button>
//         </footer>
//       </form>
//     </article>
//   );
// }

// interface FeatureListProps {
//   features: Features;
//   setFeatures: Dispatch<SetStateAction<Features>>;
// }

// function FeatureList({ features, setFeatures }: FeatureListProps) {
//   const handleTextChange = (e: ChangeEvent<HTMLInputElement>) =>
//     setFeatures(
//       features.map((feature) =>
//         feature.name === e.target.name
//           ? { ...feature, value: e.target.value }
//           : feature
//       )
//     );

//   const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) =>
//     setFeatures(
//       features.map((feature) =>
//         feature.name === e.target.name
//           ? { ...feature, value: e.currentTarget.valueAsNumber }
//           : feature
//       )
//     );
//   const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
//     console.log(e.target.checked);
//     setFeatures(
//       features.map((feature) =>
//         feature.name === e.target.name
//           ? { ...feature, value: e.target.checked }
//           : feature
//       )
//     );
//   };

//   return (
//     <>
//       {features.map((feature) => {
//         switch (feature.type) {
//           case "TEXT": {
//             return (
//               <div key={feature.name} className="pp-form__group">
//                 <label className="pp-form__label">{feature.name}</label>
//                 <input
//                   className="pp-form__field"
//                   type="text"
//                   id={feature.name}
//                   name={feature.name}
//                   value={feature.value.toString()}
//                   onChange={handleTextChange}
//                 />
//               </div>
//             );
//           }
//           case "NUMERIC": {
//             return (
//               <div key={feature.name} className="pp-form__group">
//                 <label className="pp-form__label">{feature.name}</label>
//                 <input
//                   className="pp-form__field"
//                   type="number"
//                   id={feature.name}
//                   name={feature.name}
//                   value={feature.value.toString()}
//                   onChange={handleNumberChange}
//                 />
//               </div>
//             );
//           }
//           case "BOOLEAN": {
//             return (
//               <div key={feature.name}>
//                 <label>{feature.name}</label>
//                 <input
//                   type="checkbox"
//                   id={feature.name}
//                   name={feature.name}
//                   checked={feature.value as boolean}
//                   onChange={handleCheckboxChange}
//                 />
//               </div>
//             );
//           }
//         }
//       })}
//     </>
//   );
// }
