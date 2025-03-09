import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => ({
      token: "",
      user: {}
  }),
  persist: {
    key: 'userStore',
    storage: localStorage,
    pick: ['token', 'user'],
    debug: true,
    serializer: {
      serialize: (value) => JSON.stringify(value),
      deserialize: (value) => JSON.parse(value)
    }
  }
});
