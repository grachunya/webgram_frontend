import { useContext } from "react";
import { OperatorPanelContext } from "./OperatorPanelContext";

export const useOperatorPanel = () => useContext(OperatorPanelContext);
