<script lang="ts" setup>
import { useAttrs, useCssModule, computed, getCurrentInstance, ref } from "vue";

const instance = getCurrentInstance();
const inputId = computed(() => `input-${instance?.uid}`);
const input = ref();

const attrs = useAttrs();
const style = useCssModule();
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "blur"): void;
}>();

type inputType =
  | "email"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "url";

interface Props {
  type?: inputType;
  modelValue?: string | number;
  label?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: undefined,
  error: undefined,
  success: undefined,
  label: undefined,
});

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;

  emit("update:modelValue", target.value);
};

const messageText = computed(() => {
  if (props.error) return props.error;
  if (props.success) return props.success;
  return "";
});

const classes = computed(() => {
  return {
    [style.root]: true,
    [style.root_error]: props.error,
    [style.root_success]: props.success,
    [style.root_disabled]: props.disabled,
  };
});

defineExpose({
  input,
});
</script>

<template>
  <label :class="classes" :for="inputId">
    <span v-if="label" :class="$style.label">{{ label }}</span>
    <div :class="$style.inputWrapper">
      <slot name="left" />
      <input
        :id="inputId"
        ref="input"
        :class="$style.input"
        :value="modelValue"
        :type="type"
        :disabled="disabled"
        v-bind="attrs"
        :readonly="readonly"
        @input="updateValue"
        @blur="$emit('blur')"
      />
      <slot name="right" />
    </div>
    <span v-if="error || success" :class="$style.message">
      {{ messageText }}
    </span>
  </label>
</template>

<style lang="postcss" module>
.root {
  --padding: 0 16px;
  --height: 30px;

  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  transition: var(--default-transition);
}

.inputWrapper {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: var(--padding);
  overflow: hidden;
  border: 1px solid var(--grey-color);
  border-radius: 4px;
  transition: var(--default-transition);

  &:focus-within {
    border-color: var(--grey-active-color);
  }
}

.input {
  width: 100%;
  height: var(--height);
  padding: 0;
  font-size: 14px;
  line-height: 24px;
  border: none;

  &:disabled {
    color: var(--grey-color);
  }

  &::placeholder {
    color: var(--secondary-color);
  }
}

.label {
  width: 100%;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: var(--secondary-color);
}

.message {
  width: 100%;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}

.root_error {
  & .inputWrapper {
    color: var(--error-color);
    border: 1px solid var(--error-color);
  }

  & .message {
    color: var(--error-color);
  }
}

.root_success {
  & .inputWrapper {
    color: var(--success-color);
    border: 1px solid var(--success-color);
  }

  & .message {
    color: var(--success-color);
  }
}

.root_disabled {
  & .inputWrapper {
    background-color: var(--white-color);
    border-color: var(--grey-2-color);
  }

  & .label {
    color: var(--grey-color);
  }
}
</style>
