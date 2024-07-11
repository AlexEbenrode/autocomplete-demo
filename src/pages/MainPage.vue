<script setup lang="ts">
import BaseAutocomplete from "@/components/BaseAutocomplete.vue";
import { $fetch } from "ofetch";
import debounce from "lodash/debounce";
import { computed, onMounted, ref } from "vue";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
const posts = ref<Post[]>([]);
const currentPost = ref<number>();

const postOptions = computed(() => {
  return posts.value.map((post) => ({
    label: post.title,
    value: post.id,
  }));
});

const post = computed(() => {
  return postOptions.value.find((item) => item.value === currentPost.value);
});

const fetchPosts = debounce(async (search?: string | number) => {
  posts.value = await $fetch<Post[]>(
    `https://jsonplaceholder.typicode.com/posts`,
    {
      query: {
        title_like: search,
      },
    },
  );
}, 500);

const selectPost = (value?: number | string) => {
  if (value && typeof value === "number") currentPost.value = value;
};

onMounted(async () => {
  await fetchPosts();
});
</script>

<template>
  <div :class="$style.root">
    <BaseAutocomplete
      :model-value="post"
      :options="postOptions"
      @update="fetchPosts"
      @select="selectPost"
    />
  </div>
</template>

<style module lang="postcss">
.root {
  display: flex;
  flex-direction: column;
}
</style>
