<script lang="ts" setup>
import { useCssModule, watch, ref } from "vue";
import BaseSpinner from "@/components/BaseSpinner.vue";

const style = useCssModule();

interface Value {
  [key: string]: string | number;
}
interface PropertyTypes {
  value?: Value | Value[];
  items: Value[];
  focusedIndex: number;
  labelName?: string;
  valueName?: string;
  loading?: boolean;
}

const properties = withDefaults(defineProps<PropertyTypes>(), {
  value: undefined,
  labelName: "label",
  valueName: "value",
  loading: false,
});

const emit = defineEmits<{
  (event: "select", value: string | number): void;
}>();

const autocompleteReference = ref<HTMLDivElement | undefined>();
const autocompleteListWrapper = ref<HTMLDivElement | undefined>();

const isSelected = (value: string | number) => {
  return Array.isArray(properties.value)
    ? properties.value?.some((item) => item[properties.valueName] === value)
    : properties.value?.[properties.valueName] === value;
};

const itemClasses = (value: string | number) => {
  return {
    [style.item]: true,
    [style.item_selected]: isSelected(value),
  };
};

watch(
  () => properties.focusedIndex,
  (newValue) => {
    setFocusedItem(newValue);
  },
);

const setFocusedItem = (itemIndex: number) => {
  const currentFocusedElement = autocompleteListWrapper.value?.querySelector(
    `.${style.opacity}`,
  );
  if (currentFocusedElement) {
    currentFocusedElement.classList?.remove(style.opacity);
  }
  autocompleteListWrapper.value
    ?.querySelectorAll("button")
    [itemIndex].classList?.add(style.opacity);
};

const selectFocusedValue = (item?: { [key: string]: string | number }) => {
  if (item) {
    emit("select", item[properties.valueName]);
  } else {
    const currentFocusedElement = autocompleteListWrapper.value?.querySelector(
      `.${style.opacity}`,
    );

    const textOfFindedListItem = (
      currentFocusedElement as HTMLButtonElement
    ).textContent?.trim();
    const findedListItem = properties.items.find(
      (element) => element[properties.labelName] === textOfFindedListItem,
    );

    if (findedListItem) {
      emit("select", findedListItem[properties.valueName]);
    }
  }
};

const scrollOptionsList = async (position: string) => {
  const optionsWrapper = autocompleteReference.value;

  if (
    position === "next" &&
    properties.focusedIndex === properties.items.length - 1
  ) {
    optionsWrapper?.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (position === "prev" && properties.focusedIndex === 0) {
    optionsWrapper?.scrollTo({
      top: optionsWrapper.scrollHeight,
      behavior: "smooth",
    });
    return;
  }

  if (properties.focusedIndex > 3) {
    optionsWrapper?.scrollTo({
      top:
        position === "next"
          ? optionsWrapper.scrollTop + 32
          : optionsWrapper.scrollTop - 32,
      behavior: "smooth",
    });
  }
};

const computedClass = (item: Value, index: number) => {
  return [
    itemClasses(item[properties.valueName]),
    index === 0 ? style.opacity : "",
  ];
};

defineExpose({
  selectFocusedValue,
  scrollOptionsList,
});
</script>

<template>
  <div ref="autocompleteReference" :class="$style.root" data-testid="popover">
    <BaseSpinner v-if="loading" :class="$style.spinner" />
    <div
      v-else-if="items.length > 0"
      ref="autocompleteListWrapper"
      :class="$style.list"
    >
      <button
        v-for="(item, i) in items"
        :key="item.value"
        :class="computedClass(item, i)"
        data-testid="option"
        @click="selectFocusedValue(item)"
      >
        {{ item[labelName] }}
        <span v-if="isSelected(item[valueName])" :class="$style.selectedText">
          Выбрано
        </span>
      </button>
    </div>
    <div v-else :class="$style.placeholder">
      <div :class="$style.item">Нет результатов</div>
    </div>
  </div>
</template>

<style lang="postcss" module>
.root {
  --horizontal-padding: 14px;
  --input-height: 36px;

  width: 100%;
  max-height: 160px;
  padding: 0 var(--horizontal-padding);
  overflow: auto;
  background-color: var(--white-color);
  border-radius: 4px;
  box-shadow:
    0 0 0 1px #d6d6d6,
    0 3px 7px -3px rgba(25 37 50 / 10%),
    0 6px 12px -2px rgba(25 37 50 / 10%);

  .spinner {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 10px 0;
  }
}

.list {
  display: flex;
  flex-direction: column;
  color: var(--main-text-color);
}

.item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 32px;
  text-align: start;
  cursor: pointer;
  background-color: var(--white-color);
  transition: var(--default-transition);

  &:hover,
  &:focus {
    opacity: 0.5;
  }
}

.opacity {
  opacity: 0.5;
}

.item_selected {
  font-weight: 700;
}

.selectedText {
  font-size: 12px;
  font-weight: 400;
  line-height: 32px;
  color: var(--secondary-color);
}

.placeholder {
  color: var(--secondary-color);
}
</style>
