<script lang="ts" setup>
import { ref, onBeforeUnmount, watch, onUpdated } from "vue";
import { vClickOutside } from "@/directives/clickOutside";

interface PropTypes {
  modelValue: boolean;
  position?: "left" | "right";
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<PropTypes>(), {
  modelValue: false,
  position: undefined,
  fullWidth: false,
});

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const onClose = (event: Event) => {
  if (
    popoverReference.value &&
    props.modelValue &&
    !popoverReference.value.contains(event.target)
  ) {
    emit("update:modelValue", false);
  }
};

const popoverWrapperReference = ref();
const popoverReference = ref();

const popovertop = ref();
const popoverleft = ref();
const popoverwidth = ref();

const getValueInPixels = (value: number) => `${value}px`;

const isApplyPositionFallback = (
  wrapperTop: number,
  wrapperHeight: number,
  popoverHeight: number
) => {
  const isAppleDefaultPosition =
    window.innerHeight - wrapperTop - wrapperHeight - popoverHeight > 0;
  const isApplyFallback = wrapperTop - popoverHeight > 0;

  return !isAppleDefaultPosition && isApplyFallback;
};

const setTopPosition = (
  wrapperTop: number,
  wrapperBottom: number,
  wrapperHeight: number,
  popoverHeight: number
) => {
  const wrapperGap = 4;

  popovertop.value = isApplyPositionFallback(
    wrapperTop,
    wrapperHeight,
    popoverHeight
  )
    ? getValueInPixels(
        wrapperBottom - wrapperHeight - popoverHeight - wrapperGap
      )
    : getValueInPixels(wrapperTop + wrapperHeight + wrapperGap);
};

const setLeftPosition = (
  wrapperRight: number,
  wrapperLeft: number,
  popoverwidth: number
) => {
  props.position === "left"
    ? (popoverleft.value = getValueInPixels(wrapperRight - popoverwidth))
    : (popoverleft.value = getValueInPixels(wrapperLeft));
};

const setPopoverPosition = () => {
  if (popoverWrapperReference.value) {
    const { left, right, top, height, bottom, width } =
      popoverWrapperReference.value.getBoundingClientRect();

    if (popoverReference.value) {
      if (!props.fullWidth) {
        popoverwidth.value = getValueInPixels(width);
      }

      setTopPosition(top, bottom, height, popoverReference.value.offsetHeight);

      setLeftPosition(right, left, popoverReference.value.offsetWidth);
    }
  }
};

onUpdated(() => {
  setPopoverPosition();
});

watch(
  () => props.modelValue,
  () => {
    setTimeout(() => {
      if (!document) return;

      if (props.modelValue) {
        setPopoverPosition();

        document.addEventListener("scroll", setPopoverPosition, true);
      } else {
        document.removeEventListener("scroll", setPopoverPosition, true);
      }
    });
  }
);

onBeforeUnmount(() => {
  if (document) {
    document.removeEventListener("scroll", setPopoverPosition, true);
  }
});
</script>

<template>
  <div
    ref="popoverWrapperReference"
    v-click-outside="onClose"
    :class="$style.root"
  >
    <slot name="activator" />
    <Teleport to="#teleported">
      <div
        v-if="modelValue"
        ref="popoverReference"
        :class="$style.content"
        data-testid="content-wrapper"
      >
        <slot name="content" />
      </div>
    </Teleport>
  </div>
</template>

<style lang="postcss" module>
.root {
  position: relative;
  width: inherit;
  min-width: inherit;
}

.content {
  position: fixed;
  top: v-bind(popovertop);
  left: v-bind(popoverleft);
  z-index: 12;
  width: v-bind(popoverwidth);
}
</style>
