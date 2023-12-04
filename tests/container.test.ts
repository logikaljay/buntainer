import { expect, test, it } from "bun:test"
import { Container } from "../container"

test('should inject WebService in to MyService', () => {
  const container = new Container()
  const { injectable, inject, resolve } = container

  @injectable()
  class WebService {
    request(url: string) {
      console.log("making request to", url)
    }
  }

  @injectable()
  class MyService {
    @inject(WebService) requestService!: WebService

    doThing() {
      this.requestService.request('http://www.google.com')
    }
  }

  const myService = new MyService()
  expect(myService).toBeDefined()
  expect(myService.requestService).toBeDefined()
  myService.requestService.request('foo')
})

test('should bind a service toSelf correctly', () => {
  const container = new Container()

  class Role {
    getAll() {
      return []
    }
  }

  container.bind(Role).toSelf()

  class User {
    @container.inject(Role)
    role!: Role
  }

  let user = new User()
  expect(user.role).toBeDefined()    
})

test('should bind a service to a string correctly', () => {
  const container = new Container()

  class Role {
    getAll() {
      return []
    }
  }

  container.bind("Role").to(Role)

  class User {
    @container.inject("Role")
    role!: Role
  }

  let user = new User()
  expect(user.role).toBeDefined()
  expect(user.role.getAll()).toBeArray()
})

test('should bind a string to a string', () => {
  const container = new Container()
  container.bind("foo").to("bar")
  let service = container.resolve<string>('foo')
  expect(service).toBe('bar')
})

test('should bind a string to a symbol', () => {
  const container = new Container()
  let key = Symbol('foo')
  const value = 'foobar'
  container.bind(key).to(value)
  let service = container.resolve(key)
  expect(service).toBeDefined()
  expect(service).toBe(value)
})

test('injectable should make a class injectable without binding', () => {
  const container = new Container()

  @container.injectable()
  class User {
    name: string = "UserClass"
  }

  let service = container.resolve(User)
  expect(service).toBeInstanceOf(User)
  expect(service.name).toBe('UserClass')
})