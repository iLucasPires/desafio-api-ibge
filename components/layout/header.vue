<script setup lang="ts">
const session = useUserSession();
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const items = ref([
  {
    label: "Logout",
    icon: "i-lucide-arrow-right",
    onSelect: async () => {
      await session.clear();
      await session.fetch();
      await navigateTo("/auth/login");
    },
  },
]);
</script>

<template>
  <header
    class="flex justify-between py-5 px-20 border-b border-neutral-200 dark:border-neutral-800"
  >
    <div class="flex items-center">
      <ULink to="/" class="text-2xl font-bold">
        <NuxtImg
          src="https://www1.sfiec.org.br/assets/images/logo.png"
          alt="Logo"
          width="150"
          height="150"
        />
      </ULink>
    </div>

    <div class="flex items-center gap-x-4">
      <UDropdownMenu
        :items="items"
        :content="{
          align: 'start',
          side: 'bottom',
          sideOffset: 8,
        }"
        :ui="{
          content: 'w-48',
        }"
      >
        <UButton
          :label="session.user.value?.name || 'Entrar'"
          color="neutral"
          variant="ghost"
        />
      </UDropdownMenu>

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
    </div>
  </header>
</template>
