import { request } from './api'

export function get() {
  const url = `${process.env.parseUrl}/classes/Subjects`
  return request('get', url, {})
}
export function getById(id) {
  const url = `${process.env.parseUrl}/classes/Subjects/${id}}`
  return request('get', url, {})
}

export function create(data) {
  const url = `${process.env.parseUrl}/classes/Subjects`
  return request('post', url, data)
}

export function update(data) {
  const url = `${process.env.parseUrl}/classes/Subjects/${data.objectId}`
  console.log('urlsss ', url)
  console.log('dataaa s ', data)
  return request('put', url, data)
}

export function deleteSubject(teacherId) {
  const url = `${process.env.parseUrl}/classes/Subjects/${teacherId}`
  return request('delete', url, {})
}
