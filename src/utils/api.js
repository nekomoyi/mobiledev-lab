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
  }
}