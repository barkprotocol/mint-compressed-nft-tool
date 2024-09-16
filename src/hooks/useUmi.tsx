import { useContext } from "react";
import { UmiContext } from "../providers/UmiContext";

export default function useUmi() {
  const umi = useContext(UmiContext).umi;

  return { umi };
}
