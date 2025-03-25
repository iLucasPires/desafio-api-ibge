<script setup lang="ts">
import { h } from "vue";

import type { Column } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { getPaginationRowModel } from "@tanstack/vue-table";

import type { iDados } from "~/types/agregados";

const expanded = ref<Record<number, boolean>>({ 1: true });
const resultados = defineModel<iDados[]>();
const sorting = ref([]);
const table = useTemplateRef("table");

const pagination = ref({
  pageIndex: 0,
  pageSize: 8,
});

function getHeader(column: Column<[], unknown>, label: string) {
  const isSorted = column.getIsSorted();

  return h(resolveComponent("UButton"), {
    color: "neutral",
    variant: "ghost",
    icon: isSorted === "asc" ? "i-lucide-arrow-up" : "i-lucide-arrow-down",
    label: label,
    onClick: () => column.toggleSorting(isSorted === "asc"),
  });
}

const columns: TableColumn<[]>[] = ref([
  { accessorKey: "id", header: ({ column }) => getHeader(column, "ID") },
  { accessorKey: "variavel", header: "Variável" },
  {
    accessorKey: "unidade",
    enableSorting: true,
    header: ({ column }) => getHeader(column, "Unidade"),
  },
  { accessorKey: "localidade", header: "Localidade" },
  { accessorKey: "classificacao", header: "Classificação" },
  {
    accessorKey: "ano",
    enableSorting: true,
    header: ({ column }) => getHeader(column, "Ano"),
  },
  {
    accessorKey: "valor",
    enableSorting: true,
    header: ({ column }) => getHeader(column, "Valor"),
  },
]);

const tabelaDados = computed(() => {
  if (!resultados.value) return [];

  return resultados.value.flatMap((item) => {
    return (item.resultados ?? []).flatMap((resultado) => {
      return (resultado.series ?? []).flatMap((serie) => {
        return Object.entries(serie.serie ?? {}).map(([ano, valor]) => ({
          id: item.id ?? "N/A",
          variavel: item.variavel ?? "Desconhecido",
          unidade: item.unidade ?? "N/A",
          localidade: serie.localidade?.nome ?? "Desconhecido",
          ano: ano.toString(),
          valor: valor?.toString() ?? "N/A",
        }));
      });
    });
  });
});
</script>

<template>
  <div class="flex flex-col h-full gap-4">
    <UInput
      placeholder="pesquisar por ID"
      icon="i-lucide-search"
      color="neutral"
      variant="outline"
      :model-value="(table?.tableApi?.getColumn('id')?.getFilterValue() as string)"
      class="max-w-sm min-w-[12ch]"
      @update:model-value="
        table?.tableApi?.getColumn('id')?.setFilterValue($event)
      "
    />
    <UTable
      ref="table"
      v-model:sorting="sorting"
      v-model:expanded="expanded"
      v-model:pagination="pagination"
      class="flex-1"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      :data="tabelaDados"
      :columns="columns"
    />

    <div class="flex justify-end border-t border-(--ui-border) pt-4">
      <UPagination
        :default-page="
          (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
        "
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
