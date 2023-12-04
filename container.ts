type Key = string | Symbol | (abstract new (...args: any) => any)

export class Container {
  private map: Map<Key, any> = new Map()

  resolve<T extends Key>(name: T) {
    type Result = T extends abstract new (...args: any) => any
      ? InstanceType<T>
      : any

    return this.map.get(name) as Result
  }

  bind(key: Key) {
    return {
      to: (value: Key | (new (...args: any) => any)) => {

        if (typeof value === 'function' && 'prototype' in value) {
          value = new (value as any)()
        }

        if (typeof key === 'string' || typeof key === 'symbol') {
          this.map.set(key, value)
        }
        else {
          this.map.set(key, value)
        }
      },
      toSelf: () => {
        if (typeof key === 'string' || typeof key === 'symbol') {
          this.map.set(key, key)
        }
        else {
          const constructor = key as new (...args: any) => any
          this.map.set(constructor, new constructor())
        }
      }
    } 
  }

  inject = <T extends abstract new (...args: any) => any>(service: Key | T) => {
    return (target: any, key: any) => {
      let injectedService = this.resolve(service) as InstanceType<T>
      target[key] = injectedService
    }
  }

  injectable = (key?: Key) => {
    return (target: any, property?: any) => {
      if (key) {
        this.map.set(key, target)
      }
      else {
        this.map.set(target, new target())
      }
    }
  }
}
