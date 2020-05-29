import { request } from './api'

export function get() {
  const url = `${process.env.parseUrl}/classes/Students`
  return request('get', url, {})
}

export function getById(studentId) {
  const url = `${process.env.parseUrl}/classes/Students/${studentId}`
  return request('get', url, {})
}

export function create(data) {
  const url = `${process.env.parseUrl}/classes/Students`
  return request('post', url, data)
}

export function edit(data) {
  const url = `${process.env.parseUrl}/users`
  return request('put', url, data)
}

export function deleteStudent(studentId) {
  const url = `${process.env.parseUrl}/users`
  return request('delete', url, studentId)
}
