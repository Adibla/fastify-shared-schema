# fastify-shared-schema
`fastify-shared-schema` is a plugin for the Fastify ecosystem. It allows you to share the same parent JSON schema across different routes to avoid repetition and compose your schemas in a modular way.
You can also use **[ajv-merge-patch](https://github.com/ajv-validator/ajv-merge-patch)** for the same purpose, but with **fastify-shared-schema** you do not need to change your schema syntax

## Status
`fastify-shared-schema` is a new project. Please report any problems so we can fix them!

## Installation
```shell
npm i fastify-shared-schema
```
## Compatibility
From Fastify V4 the route definition is synchronous, for this plugin to work you have to register it with **await register(...)**, before V4 this is not necessary.

## Usage
To use this plugin, you must register it by passing an object configuration in this format:

```ts
export type RoutesToApply = {
    [routeName: string]: HTTPMethods[]
}

export type PluginOptions = {
    routesToApply: RoutesToApply,
    commonSchema: FastifySchema
}
```

CommonSchema is the common schema applied to all corresponding routes (only if registered in your fastify instance) present in the routesToApply object

EG
```ts
routestToApply: {
    "product": ['GET', 'POST'],
    "anotherRoute": ['PATCH']
}
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
      commonSchema: {
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
    commonSchema: {
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
To run unit tests
```shell
npm run test
```

## License
[MIT](./LICENSE)
