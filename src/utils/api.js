import constants from "./constants"
import { useUserStore } from "@/stores/user"

export default {
  login: async (username, password) => {
    let resp = await fetch(`${constants.ENDPOINT}/auth/jwt/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `username=${username}&password=${password}`
    })
    let data = await resp.json()
    return data
  },
  userInfo: async () => {
    let resp = await fetch(`${constants.ENDPOINT}/users/me`, {
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  userDetail: async () => {
    let resp = await fetch(`${constants.ENDPOINT}/users/mine/`, {
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  userRename: async (name, avatar) => {
    let resp = await fetch(`${constants.ENDPOINT}/users/rename/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": useUserStore().token
      },
      body: JSON.stringify({ name, avatar })
    })
    let data = await resp.json()
    return data
  },
  register: async (email, password) => {
    let resp = await fetch(`${constants.ENDPOINT}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email, password,
        is_active: true, is_superuser: false, is_verified: false
      })
    })
    let data = await resp.json()
    return data
  },
  getArticles: async (offset=0, limit=100) => {
    let resp = await fetch(`${constants.ENDPOINT}/items/auto-refresh/0?skip=${offset}&limit=${limit}`)
    let data = await resp.json()
    return data
  },
  getArticle: async (articleId) => {
    let resp = await fetch(`${constants.ENDPOINT}/items/${articleId}`)
    let data = await resp.json()
    return data
  },
  comment: async (articleId, commentData) => {
    let resp = await fetch(`${constants.ENDPOINT}/comments/${articleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': useUserStore().token
      },
      body: JSON.stringify(commentData)
    })
    let data = await resp.json()
    return data
  },
  deleteComment: async (commentId) => {
    let resp = await fetch(`${constants.ENDPOINT}/delete-comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  getMyComments: async () => {
    let resp = await fetch(`${constants.ENDPOINT}/comments/mine/`, {
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  starArticle: async (articleId) => {
    let resp = await fetch(`${constants.ENDPOINT}/items/put/addstar/${articleId}`, {
      method: 'POST',
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  getUserArticles: async (uuid='', keyword = '') => {
    let resp = await fetch(`${constants.ENDPOINT}/items/users/${uuid}?keyword=${keyword}`)
    let data = await resp.json()
    return data
  },
  deleteArticle: async (articleId) => {
    let resp = await fetch(`${constants.ENDPOINT}/deleteitem-byid/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  }
}