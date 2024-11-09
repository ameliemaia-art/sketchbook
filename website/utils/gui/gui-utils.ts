import { BindingApi } from "@tweakpane/core";

export function clearBindings(bindings: BindingApi[]) {
  bindings.forEach((binding) => binding.dispose());
}

export function generateBindingOptions(arr: string[] | number[]) {
  const options: { [key: string]: string | number } = {};
  arr.forEach((item) => {
    options[item] = item;
  });
  return options;
}
