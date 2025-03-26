<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="flex flex-col h-screen">
    <LayoutHeader />
    <div class="flex flex-1 ">
      <!-- <LayoutAsidebar /> -->
      <LayoutContent />
    </div>
  </div>
</template>
