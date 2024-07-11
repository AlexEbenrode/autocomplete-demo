<script setup lang="ts">
import { computed, useCssModule } from "vue";

const style = useCssModule();

const props = defineProps({
  large: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => ({
  [style.root]: true,
  [style._large]: props.large,
  [style._small]: props.small,
}));
</script>

<template>
  <span :class="classes">
    <span />
    <span />
    <span />
    <span />
  </span>
</template>

<style lang="postcss" module>
.root {
  --spinner-color: var(--primary-color);

  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
}

.root span {
  position: absolute;
  box-sizing: border-box;
  display: block;
  width: 28px;
  height: 28px;
  border: 3px solid var(--spinner-color);
  border-color: var(--spinner-color) transparent transparent transparent;
  border-radius: 50%;
  animation: root 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

._large {
  width: 50px;
  height: 50px;
}

._large span {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

._small {
  width: 18px;
  height: 18px;
}

._small span {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.root span:nth-child(1) {
  animation-delay: -0.45s;
}

.root span:nth-child(2) {
  animation-delay: -0.3s;
}

.root span:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes root {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
