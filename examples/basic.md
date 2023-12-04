# basic usage

**container.ts**

Setup your container by importing the class and creating a new container in your container.ts file.

```ts
import { Container } from "@5oo/buntainer"
const container = new Container()
const { bind, resolve, inject, injectable } = container
export { container }
```

**user.ts**

Define a service and mark it as `injectable`

```ts
import { container } from "./container"

@container.injectable()
class UserRepository {
  getAll() {
    // get all users
  }
}
```

**index.ts**

Resolve the injectable `UserRespository` service

```ts
import { container } from "./container"
import { UserRepository } from "./user"

async function main() {
  let userRepository = container.resolve(UserRepository)
  console.log(userRepository.getAll())
}

main()
```