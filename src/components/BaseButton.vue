<script lang="ts" setup>
import { computed, useAttrs, useCssModule } from "vue";

const attrs = useAttrs();
const style = useCssModule();

interface Properties {
  tag?: "a" | "button" | "RouterLink";
  icon?: boolean;
  block?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  small?: boolean;
  danger?: boolean;
}

const properties = withDefaults(defineProps<Properties>(), {
  tag: "button",
  icon: false,
  block: false,
  secondary: false,
  tertiary: false,
  small: false,
});

const classes = computed(() => {
  return {
    [style.root]: true,
    [style.root_icon]: properties.icon,
    [style.root_block]: properties.block,
    [style.root_secondary]: properties.secondary,
    [style.root_tertiary]: properties.tertiary,
    [style.root_small]: properties.small,
    [style.root_danger]: properties.danger,
  };
});
</script>

<template>
  <Component :is="tag" :class="classes" v-bind="attrs">
    <slot />
  </Component>
</template>

<style lang="postcss" module>
.root {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-height: 38px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--white-color);
  cursor: pointer;
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  transition: var(--default-transition);

  &:hover {
    background-color: var(--primary-hover-color);
  }

  &:active {
    background-color: var(--primary-active-color);
    transform: translateY(1px);
  }

  &[disabled] {
    pointer-events: none;
    user-select: none;
    background-color: var(--grey-2-color);
    border-color: var(--grey-2-color);
  }

  &_block {
    width: 100%;
  }

  &_icon {
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: inherit;
    color: inherit;
    background-color: transparent;
    border: none;

    &:hover {
      background-color: transparent;
    }

    &:active {
      background-color: transparent;
    }

    &[disabled] {
      color: var(--grey-2-color);
      background-color: transparent;
      border: none;
    }
  }

  &_secondary {
    color: var(--black-color);
    background-color: transparent;
    border: 1px solid var(--black-color);

    &:hover {
      background-color: var(--hover-color);
    }

    &:active {
      background-color: var(--active-color);
      transform: translateY(1px);
    }

    &[disabled] {
      color: var(--grey-2-color);
      background-color: var(--white-color);
      border-color: var(--grey-2-color);
    }

    &.root_danger {
      color: var(--error-color);
      border-color: var(--error-color);
    }
  }

  &_tertiary {
    color: var(--white-color);
    background-color: var(--black-color);
    border: 1px solid var(--black-color);

    &:hover {
      color: #cce3e9;
      background-color: var(--black-color);
    }

    &:active {
      color: #aad5e0;
      background-color: var(--black-color);
      transform: translateY(1px);
    }

    &.root_danger {
      background-color: var(--error-color);
      border-color: var(--error-color);
    }
  }

  &_small {
    height: 32px;
    padding: 0 14px;
  }
}

@media (--x-small-vp) {
  .root {
    height: 30px;
    padding: 0 8px;
    font-size: 10px;
    line-height: 12px;

    &_icon {
      width: 24px;
      height: 24px;
      padding: 0;
    }

    &_secondary {
      height: 28px;
    }
  }
}
</style>
