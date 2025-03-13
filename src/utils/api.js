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
  getArticles: async (offset = 0, limit = 100, keyword = '') => {
    let url = `${constants.ENDPOINT}/items/auto-refresh/0?skip=${offset}&limit=${limit}`
    if (keyword)
      url += `&keyword=${keyword}`
    let resp = await fetch(url)
    let data = await resp.json()
    return data
  },
  getArticle: async (articleId) => {
    let resp = await fetch(`${constants.ENDPOINT}/items/${articleId}`)
    let data = await resp.json()
    if (data.images)
      data.images.sort((a, b) => a.order - b.order)
    if (data.comments)
      data.comments = data.comments.filter(comment => comment.parent_id === null)
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
    let resp = await fetch(`${constants.ENDPOINT}/items/${articleId}/star`, {
      method: 'PUT',
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
  },
  deleteImage: async (imagePath) => {
    let resp = await fetch(`${constants.ENDPOINT}/deleteimage-bypath${imagePath}`, {
      method: "DELETE",
      headers: {
        'Authorization': useUserStore().token
      },
    })
    let data = await resp.json()
    return data
  },
  deleteImageById: async (imageId) => {
    let resp = await fetch(`${constants.ENDPOINT}/deleteimage-byid/${imageId}`, {
      method: "DELETE",
      headers: {
        'Authorization': useUserStore().token
      },
    })
    let data = await resp.json()
    return data
  },
  createArticle: async (articleData) => {
    let resp = await fetch(`${constants.ENDPOINT}/items/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': useUserStore().token
      },
      body: JSON.stringify(articleData)
    })
    let data = await resp.json()
    return data
  },
  updateArticleById: async (articleId, articleData) => {
    let resp = await fetch(`${constants.ENDPOINT}/items/put/${articleId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': useUserStore().token
      },
      body: JSON.stringify(articleData)
    })
    let data = await resp.json()
    return data
  },
  uploadImageToArticle: async (articleId, imageData) => {
    let resp = await fetch(`${constants.ENDPOINT}/uploadimage/${articleId}`, {
      method: "POST",
      headers: {
        'Authorization': useUserStore().token
      },
      body: JSON.stringify(imageData)
    })
    let data = await resp.json()
    return data
  },
  updateImageById: async (imageId, imageData) => {
    let resp = await fetch(`${constants.ENDPOINT}/modifyimage/${imageId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': useUserStore().token
      },
      body: JSON.stringify(imageData)
    })
    let data = await resp.json()
    return data
  },
  uploadOrUpdateImageToArticleById: async (articleId, imageData) => {
    let resp = await fetch(`${constants.ENDPOINT}/modifyimage/${articleId}/${imageData.id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': useUserStore().token
      },
      body: JSON.stringify({
        name: imageData.name,
        url: imageData.url,
        img_content: imageData.img_content,
        order: imageData.order,
      })
    })
    let data = await resp.json()
    return data
  },
  getUserReadLogs: async () => {
    let resp = await fetch(`${constants.ENDPOINT}/user/readlogs`, {
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  addReadLog: async (articleId) => {
    let resp = await fetch(`${constants.ENDPOINT}/user/readlogs/${articleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  getFollowList: async () => {
    let resp = await fetch(`${constants.ENDPOINT}/user/follow`, {
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  updateFollow: async (followee_id) => {
    let resp = await fetch(`${constants.ENDPOINT}/user/follow/${followee_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  getFollowUnread: async () => {
    let resp = await fetch(`${constants.ENDPOINT}/user/follow/unread/`, {
      headers: {
        'Authorization': useUserStore().token
      }
    })
    let data = await resp.json()
    return data
  },
  getRecommends: async () => {
    let resp = await fetch(`${constants.ENDPOINT}/recommends/`)
    let data = await resp.json()
    return data
  }
}