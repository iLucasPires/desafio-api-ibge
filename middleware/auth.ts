export default defineNuxtRouteMiddleware(async (to, _) => {
  const userSession = useUserSession();

  if (!userSession.loggedIn.value && to.matched[0].path !== "/auth") {
    return navigateTo("/auth/login");
  }

  if (userSession.loggedIn.value && to.path === "/auth") {
    return navigateTo("/");
  }
});
