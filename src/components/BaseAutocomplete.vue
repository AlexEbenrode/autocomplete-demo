<script setup lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import { computed, ref, useAttrs, watch } from "vue";
import BasePopover from "@/components/BasePopover.vue";
import AutocompletePopoverContent from "@/components/AutocompletePopoverContent.vue";
import BaseButton from "@/components/BaseButton.vue";
import debounce from "lodash/debounce";

const emit = defineEmits<{
  (event: "select", value: string | number | undefined): void;
  (event: "update", value: string): void;
}>();

interface ModelValue {
  [key: string]: string | number;
}

interface PropertyTypes {
  label?: string;
  modelValue?: ModelValue | ModelValue[];
  options: ModelValue[];
  clearAfterSelect?: boolean;
  searchFields?: string[];
  labelName?: string;
  valueName?: string;
  disabled?: boolean;
  error?: string;
  clearable?: boolean;
  loading?: boolean;
}

const properties = withDefaults(defineProps<PropertyTypes>(), {
  label: undefined,
  labelName: "label",
  valueName: "value",
  modelValue: undefined,
  searchFields: () => [],
  error: "",
  clearable: false,
  loading: false,
});

const attrs = useAttrs();
const isOpenPopover = ref(false);
const autocompleteInputReference = ref();
const autocompletePopoverReference = ref();
const currentFocusedIndex = ref(0);

const inputValue = ref(
  !properties.modelValue || Array.isArray(properties.modelValue)
    ? ""
    : properties.modelValue[properties.labelName],
);

const filteredItems = computed(() =>
  properties.options.filter((option) => {
    if (
      typeof option[properties.labelName] === "string" &&
      typeof inputValue.value === "string" &&
      option[properties.labelName]
    ) {
      let values = [
        option[properties.labelName].toString().toLowerCase(),
        option[properties.valueName].toString().toLowerCase(),
      ];

      if (properties.searchFields) {
        values = [
          ...values,
          ...properties.searchFields.map(
            (field) => option[field]?.toString().toLowerCase() ?? "",
          ),
        ];
      }
      const value = inputValue.value.toLowerCase();

      return values.some((item) => item.includes(value));
    }
    return false;
  }),
);

const onOpen = () => {
  if (!isOpenPopover.value) {
    isOpenPopover.value = true;
  }
};

const onClose = () => {
  if (isOpenPopover.value) {
    isOpenPopover.value = false;
  }
};

const updateInput = debounce(async (value: string | number) => {
  if (typeof value === "string") {
    inputValue.value = value;
    emit("update", value);
    onOpen();
  }
  currentFocusedIndex.value = 0;
}, 500);

const selectItem = (value: string | number) => {
  const newValue = Array.isArray(properties.modelValue)
    ? ""
    : properties.options.find((option) => {
        return option[properties.valueName] === value;
      })?.[properties.labelName];
  if (newValue || newValue === "") {
    inputValue.value = properties.clearAfterSelect ? "" : newValue.toString();

    emit("select", value);
    onClose();
  }

  if (autocompleteInputReference.value?.input)
    autocompleteInputReference.value.input.focus();
};

const onClear = () => {
  // eslint-disable-next-line unicorn/no-useless-undefined
  emit("select", undefined);
  inputValue.value = "";
  onClose();
};

const changeFocusedValue = (position: string) => {
  const itemCount = filteredItems.value.length;
  if (itemCount === 1) {
    currentFocusedIndex.value = 0;
    return;
  }

  currentFocusedIndex.value =
    position === "next"
      ? (currentFocusedIndex.value + 1) % itemCount
      : (currentFocusedIndex.value - 1 + itemCount) % itemCount;

  autocompletePopoverReference.value?.scrollOptionsList(position);
};

const selectFocusedValue = () => {
  autocompletePopoverReference.value?.selectFocusedValue();
};

const fetchALLItemsList = () => {
  onOpen();
  !inputValue.value && emit("update", "");
};

watch(
  () => properties.modelValue,
  (newValue) => {
    if (!newValue) {
      inputValue.value = "";
    }
  },
);
</script>

<template>
  <div :class="$style.root">
    <BasePopover v-model="isOpenPopover">
      <template #activator>
        <BaseInput
          ref="autocompleteInputReference"
          :model-value="inputValue"
          :label="label"
          v-bind="attrs"
          :disabled="disabled"
          @update:model-value="updateInput"
          @keydown.shift.down.prevent.stop="changeFocusedValue('next')"
          @keydown.shift.up.prevent.stop="changeFocusedValue('prev')"
          @keydown.enter.prevent.stop="selectFocusedValue"
          @focus="fetchALLItemsList"
        >
          <template #right>
            <BaseButton v-if="clearable" icon @click="onClear"> X </BaseButton>
          </template>
        </BaseInput>
      </template>
      <template #content>
        <AutocompletePopoverContent
          ref="autocompletePopoverReference"
          :loading="loading"
          :items="filteredItems"
          :value="modelValue as []"
          :label-name="labelName"
          :value-name="valueName"
          :focused-index="currentFocusedIndex"
          @select="selectItem"
        />
      </template>
    </BasePopover>
    <span v-if="error" :class="$style.error">{{ error }}</span>
  </div>
</template>

<style module lang="postcss">
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 250px;
}

.error {
  margin: 4px 0 0 20px;
  font-size: 12px;
  line-height: 20px;
  color: var(--error-color);
}

.icon {
  font-size: 10px;
  color: var(--secondary-color);
}
</style>
