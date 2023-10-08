import { Children, ReactElement, ReactNode, isValidElement } from "react";

export function getValidChildren(children: ReactNode) {
  return Children.toArray(children).filter(isValidElement) as ReactElement[];
}