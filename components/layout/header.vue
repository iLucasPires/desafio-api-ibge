<script setup>
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<template>
  <header
    class="flex justify-between py-5 px-20 border-b border-neutral-200 dark:border-neutral-800"
  >
    <div class="flex items-center">
      <h1 class="text-2xl font-bold">My App</h1>
    </div>

    <ClientOnly v-if="!colorMode?.forced">
      <UButton
        :label="isDark ? 'Modo escuro' : 'Modo claro'"
        :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        @click="isDark = !isDark"
      />

      <template #fallback>
        <div class="size-8" />
      </template>
    </ClientOnly>
  </header>
</template>
