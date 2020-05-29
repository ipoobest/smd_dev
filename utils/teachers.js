import { request } from './api'

export function get() {
  const url = `${process.env.parseUrl}/users?where={"type":"teacher"}`

  return request('get', url, {})
}
export function getById(id) {
  const url = `${process.env.parseUrl}/users/${id}}`
  return request('get', url, {})
}

export function create(data) {
  const url = `${process.env.parseUrl}/users`
  return request('post', url, data)
}

export function update(data) {
  const url = `${process.env.parseUrl}/users/${data.objectId}`
  return request('put', url, data)
}

export function deleteTeacher(teacherId) {
  const url = `${process.env.parseUrl}/users/${teacherId}`
  return request('delete', url, {})
}
