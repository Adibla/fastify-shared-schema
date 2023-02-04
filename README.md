# fastify-shared-schema


`fastify-shared-schema` is a plugin for the Fastify ecosystem. It lets you share the same parent JSON schema for different routes, in order to avoid repetition and compose your schemas in a modular way.
You can also use **[ajv-merge-patch](https://github.com/ajv-validator/ajv-merge-patch)** for the same purpose, but with **fastify-shared-schema** you do not have to change your schema syntax

## Status

`fastify-shared-schema` is a new project. Please report any issues so we can correct them!

## Installation

```shell
npm i fastify-shared-schema
```

## Example

```ts
import Fastify from 'fastify'
import fastifySharedSchema from 'fastify-shared-schema'

async function loader(){
  const fastify = Fastify({
    logger: true
  })
  await fastify.register(fastifySharedSchema, {
      baseSchema: {
      body: {
        type: 'object',
        properties: {
          name: {type: 'string'}
        },
        required: ["name"]
      }
    },
    routesToApply: {
      "product": ['post', 'get', 'patch']
    }
  });

  fastify.post("/test", {
    handler: async (req,res) => {
      return res.send({hello:"world"})
    },
    schema: {
      body: {
        type: 'object',
        properties: {
          lastname: { type: 'string'}
        },
      },
    }})
  
  fastify.patch("/test", {
    handler: async (req,res) => {
      return res.send({hello:"world"})
    },
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string'}
        },
      },
    }})

  fastify.listen(3000)
}

loader()
```

Alternatively, using CJS

```js
const fastify = require('fastify')({
  logger: true
})

const fastifySharedSchema = require("fastify-shared-schema")

async function loader(){
  await fastify.register(fastifySharedSchema, {
    baseSchema: {
      body: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          excitement: {type: 'integer'}
        },
        required: ["name"]
      }
    },
    routesToApply: {
      "product": ['post', 'get', 'patch']
    }
  });

  fastify.post("/product", {
    handler: async (req,res) => {
      return res.send({hello:"world"})
    },
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          excitement: { type: 'integer'}
        },
      },
    }})

  fastify.listen(3000)
}

loader()
```


## Test
In order to run unit tests run
```shell
npm run test
```

## License
[MIT](./LICENSE)
