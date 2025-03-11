import { defineStore } from "pinia";
export const useLikeStore = defineStore("like", {
  state: () => ({
    likes: [],
  }),
  actions: {
    like(id) {
      this.likes.push({
        id,
        timestamp: Date.now()
      })
    },
    isValidLike(id) {
      return !this.likes.some(like => like.id === id && like.timestamp > Date.now() - 24 * 60 * 60 * 1000)
    },
    clean() {
      this.likes = this.likes.filter(like => like.timestamp > Date.now() - 24 * 60 * 60 * 1000)
    }
  },
  persist: {
    key: 'likeStore',
    storage: localStorage,
    debug: true,
    serializer: {
      serialize: (value) => JSON.stringify(value),
      deserialize: (value) => JSON.parse(value)
    }
  }
});
