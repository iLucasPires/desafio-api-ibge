<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  middleware: ["auth"],
});

const userSession = useUserSession();
const toast = useToast();

const form = reactive({
  username: "",
  password: "",
});

const loginSchema = z.object({
  username: z.string().email("Insira um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

async function login() {
  const data = await $fetch("/api/auth/login", {
    method: "POST",
    body: { username: form.username, password: form.password },

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
      description: "Login successful",
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
        <h1 class="text-3xl font-bold">Entrar</h1>
        <p class="text-neutral-600">Faça login para acessar o sistema</p>
      </div>
      <UForm class="flex flex-col gap-y-4 mt-4" :schema="loginSchema" :state="form" @submit="login" >
        <UFormField class="w-full" label="Email" name="email">
          <UInput
            v-model="form.username"
            class="w-full"
            type="email"
            autocomplete="username"
            placeholder="Insira seu email ou nome de usuário"
          />
        </UFormField>

        <UFormField class="w-full" label="Senha" name="password">
          <UInput
            v-model="form.password"
            class="w-full"
            type="password"
            autocomplete="current-password"
            placeholder="Insira sua senha"
          />
        </UFormField>

        <UButton label="Login" color="primary" block type="submit" />

        <div class="flex justify-center">
          <p class="text-sm">
            Não tenho uma conta?

            <ULink to="/auth/register" class="text-primary-600 hover:underline">
              Registre-se</ULink
            >
          </p>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
