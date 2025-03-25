<script lang="ts" setup>
import { BarChart, LegendPosition } from "vue-ts-lib";
import type { iDados } from "~/types/agregados";

const resultados = defineModel<iDados[]>();

const RevenueData = computed(() => {
  const dataMap: Record<string, any> = {};

  resultados.value?.forEach((item) => {
    item.resultados?.forEach((resultado) => {
      resultado.series?.forEach((serie) => {
        Object.entries(serie.serie || {}).forEach(([ano, valor]) => {
          if (!dataMap[ano]) {
            dataMap[ano] = { ano };
          }
          dataMap[ano][item.variavel] = Number(valor) || 0;
        });
      });
    });
  });

  return Object.values(dataMap);
});

const RevenueCategories = computed(() => {
  const categorias: Record<string, { name: string; color: string }> = {};
  resultados.value?.forEach((item, index) => {
    categorias[item.variavel] = {
      name: item.variavel,
      color: ["#007F45", "#FF5733", "#3399FF", "#FFD700"][index % 4],
    };
  });
  return categorias;
});

const xFormatter = (item: { ano: string }) => `${item.ano}`;
const yFormatter = (i: number) => i;
</script>

<template>
  <BarChart
    v-if="RevenueData.length"
    :data="RevenueData"
    :height="250"
    :categories="RevenueCategories"
    :y-axis="Object.keys(RevenueCategories)"
    :x-num-ticks="6"
    :radius="4"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :pagination-position="LegendPosition.Top"
  />
</template>
