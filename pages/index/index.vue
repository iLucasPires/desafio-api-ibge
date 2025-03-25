<script lang="ts" setup>
import type { iMetadados, iDados } from "@/types/agregados";

const runtimeConfig = useRuntimeConfig();

const query = ref("");
const meta = useAsyncData<iMetadados>("metadados", () =>
  $fetch(`${runtimeConfig.public.apiPia}/metadados`)
);

const aRef = ref<number[]>([]);
const vRef = ref<number[]>([]);
const ccRef = ref<number[]>([]);

const menuData = computed(() => {
  const end = meta.data.value?.periodicidade?.fim || 0;
  const start = meta.data.value?.periodicidade?.inicio || 0;
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const menuVariaveis = computed(() =>
  meta.data.value?.variaveis.map((item) => ({
    id: item.id,
    label: item.nome,
  }))
);

const menuClassificacoes = computed(() =>
  meta.data.value?.classificacoes.flatMap((item) =>
    item.categorias.map((item2) => ({
      id: item2.id,
      label: item2.nome,
    }))
  )
);

onMounted(() => {
  if (!meta.data.value) return;

  const { periodicidade, variaveis, classificacoes } = meta.data.value;

  aRef.value = [periodicidade?.inicio || 0];
  vRef.value = [variaveis?.[0]?.id || 0];
  ccRef.value = [classificacoes?.[0]?.categorias?.[0]?.id || 0];
});

watch([aRef, vRef, ccRef], () => {
  query.value = queryBuildAgregados(
    aRef.value.join("|"),
    vRef.value.join("|"),
    meta.data.value?.classificacoes[0].id || 0,
    ccRef.value.join(",")
  );

  console.log(query.value);
});

const urlResultados = computed(
  () => `${runtimeConfig.public.apiPia}/${query.value}`
);
const resultados = await useFetch<iDados[]>(urlResultados, {
  watch: [query],
  default: () => [],
});

const typesView = ref("table");
const typesViewItems = [
  {
    label: "Tabela",
    value: "table",
    icon: "i-lucide-table",
  },
  {
    label: "Grafico",
    value: "chart",
    icon: "i-lucide-chart-bar",
  },
];
</script>

<template>
  <div>
    <div class="flex flex-col lg:flex-row justify-between items-center mb-5">
      <div class="space-y-1 mb-5">
        <h1 class="text-xl font-black">{{ meta.data.value?.pesquisa }}</h1>
        <p class="text-neutral-600">{{ meta.data.value?.nome }}</p>
      </div>
      <UTabs
        v-model="typesView"
        size="sm"
        class="w-54"
        :content="false"
        :items="typesViewItems"
      />
    </div>

    <UCard>
      <template #header>
        <div class="flex w-full overflow-auto gap-2">
          <USelect
            v-model="aRef"
            :items="menuData || []"
            value-key="id"
            class="w-20 lg:w-56 xl:w-64 flex-1"
            placeholder="ano"
            icon="i-lucide-calendar"
            multiple
          />

          <USelect
            v-model="vRef"
            :items="menuVariaveis || []"
            value-key="id"
            class="w-20 lg:w-56 xl:w-64 flex-1"
            placeholder="variaveis"
            icon="i-lucide-filter"
            multiple
          />

          <USelect
            v-model="ccRef"
            :items="menuClassificacoes || []"
            value-key="id"
            class="w-20 lg:w-56 xl:w-64 flex-1"
            placeholder="classificacoes"
            icon="i-lucide-filter"
            multiple
          />
        </div>
      </template>

      <PagesDatableResultados
        v-if="resultados.data.value?.length && typesView === 'table'"
        v-model="resultados.data.value"
      />

      <PagesChartResultados
        v-if="resultados.data.value?.length && typesView === 'chart'"
        v-model="resultados.data.value"
      />
    </UCard>
  </div>
</template>
