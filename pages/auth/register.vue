<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  middleware: ["auth"],
});

const userSession = useUserSession();
const toast = useToast();
const form = reactive({
  name: "",
  username: "",
  password: "",
});


const schema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  username: z.string().email("Insira um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

async function onSubmit() {
  console.log(form);
  const data = await $fetch("/api/auth/register", {
    method: "POST",
    body: {
      name: form.name,
      username: form.username,
      password: form.password,
    },

    onResponseError({ response }) {
      toast.add({
        title: "Error",
        color: "error",
        description: response._data.message,
      });
    },
  });

  if (data) {
    await userSession.fetch();
    await navigateTo("/");

    toast.add({
      title: "Success",
      color: "success",
      description: "Register successful",
    });
  }
}
</script>

<template>
  <UContainer
    class="w-full items-center justify-center h-screen flex flex-col gap-y-4"
  >
    <NuxtImg
      src="https://www1.sfiec.org.br/assets/images/logo.png"
      alt="Logo"
      width="150"
      height="150"
    />
    <UCard class="md:w-[32rem] w-full">
      <div>
        <h1 class="text-3xl font-bold">Cadastrar</h1>
        <p class="text-neutral-600">Faça login para acessar o sistema</p>
      </div>

      <UForm
        class="flex flex-col gap-y-4 mt-4"
        :state="form"
        :schema="schema"
        @submit="onSubmit"
      >
        <UFormField class="w-full" label="Name" name="name">
          <UInput
            v-model="form.name"
            class="w-full"
            type="text"
            autocomplete="name"
            placeholder="Enter your name"
          />
        </UFormField>

        <UFormField class="w-full" label="Email" name="email">
          <UInput
            v-model="form.username"
            class="w-full"
            type="email"
            autocomplete="username"
            placeholder="Enter your email"
          />
        </UFormField>

        <UFormField class="w-full" label="Password" name="password">
          <UInput
            v-model="form.password"
            class="w-full"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
          />
        </UFormField>

        <UButton type="submit" label="Login" color="primary" block />

        <div class="flex justify-center">
          <p class="text-sm">
            Já possui uma conta?
            <ULink to="/auth/login" class="text-primary-600 hover:underline">
              Entrar</ULink
            >
          </p>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
