import { defineStore } from "pinia";
export const useRefreshStore = defineStore("refresh", {
  state: () => ({
    comment: false,
    article: false,
    interval: 1000,
  }),
  persist: {
    key: 'refreshStore',
    storage: localStorage,
    debug: true,
    serializer: {
      serialize: (value) => JSON.stringify(value),
      deserialize: (value) => JSON.parse(value)
    }
  }
});
