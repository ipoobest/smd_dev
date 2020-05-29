import { request } from './api'

export function get() {
  const url = `${process.env.parseUrl}/classes/Classes`
  return request('get', url, {})
}
export function getById(id) {
  const url = `${process.env.parseUrl}/classes/Classes/${id}}`
  return request('get', url, {})
}

export function create(data) {
  const url = `${process.env.parseUrl}/classes/Classes`
  return request('post', url, data)
}

export function update(data) {
  const url = `${process.env.parseUrl}/classes/Classes/${data.objectId}`
  return request('put', url, data)
}

export function deleteClasses(classId) {
  const url = `${process.env.parseUrl}/classes/S2563/${classId}`
  return request('delete', url, {})
}

export function getClassById(id) {
  const url = `${process.env.parseUrl}/classes/Class_Student?where={"classId":"${id}"}`
  return request('get', url, {})
}
