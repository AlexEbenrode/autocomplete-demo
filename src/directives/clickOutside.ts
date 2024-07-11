import { type DirectiveBinding } from "vue";
type IClickOutsideEvent = (event: MouseEvent) => void;

interface ICustomHTMLElement extends HTMLElement {
  clickOutsideEvent: IClickOutsideEvent;
}

export const vClickOutside = {
  mounted: (element: ICustomHTMLElement, binding: DirectiveBinding) => {
    element.clickOutsideEvent = function (event: MouseEvent) {
      const node = event.target;

      if (
        node instanceof Node &&
        typeof binding.value === "function" &&
        !element.contains(node)
      ) {
        binding.value(event);
      }
    };

    document.addEventListener("click", element.clickOutsideEvent);
  },
  beforeUnmount: (element: ICustomHTMLElement) => {
    document.removeEventListener("click", element.clickOutsideEvent);
  },
};
