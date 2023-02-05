'use strict'

const Fastify = require('fastify')
const { test, only } = require('tap')
const fastifyCommonSchema = require('../dist/index')

test('Should exit with error if commonSchema is not passed', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  try {
    await fastify.register(fastifyCommonSchema, {
      routesToApply: {
        "product": ['post', 'get', 'patch']
      }
    })
  }catch (e){
    t.equal(e.message, "You must specify common schema (in right format) for your routes!")
  }
})

test('Should exit with error if routesToApply is not passed', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  try {
    await fastify.register(fastifyCommonSchema, {
      commonSchema: {}
    })
  }catch (e){
    t.equal(e.message, "You must specify routes (in the right format) in which apply common schema!")
  }
})

test('Should ignore commonSchema if methods in routesToApply are not list', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  try {
    await fastify.register(fastifyCommonSchema, {
      routesToApply: {
        "product": {}
      },
      commonSchema: {
        body: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          },
          required: ["name"]
        }
      },
    })

    fastify.post('/product', {
      handler: (req, res) => res.send({test: true})
    })

    const response = await fastify.inject({
      method: 'POST',
      url: '/product',
      body: {
        surname: "pippo"
      }
    })
    t.equal(response?.statusCode, 200)
  } catch (e){

  }
})

test('Should exit with error if commonSchema is empty object', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  try {
    await fastify.register(fastifyCommonSchema, {
      commonSchema: {},
      routesToApply: {
        "product": ['get', 'patch']
      }
    })
  }catch (e){
    t.equal(e.message, "You must specify common schema (in right format) for your routes!")
  }
})

test('Should exit with error if routesToApply is empty object', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  try {
    await fastify.register(fastifyCommonSchema, {
      routesToApply: {},
      commonSchema: {
        body: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          },
          required: ["name"]
        }
      },
    })

  }catch (e){
    t.equal(e.message, "You must specify routes (in the right format) in which apply common schema!")
  }

})


test('Should return validation error if common schema is added', async (t) => {
  t.plan(2)
  const fastify = new Fastify()
  await fastify.register(fastifyCommonSchema, {
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
  })
  fastify.post('/product', (req, res) => res.send(42))
  const response = await fastify.inject({
    method: 'POST',
    url: '/product',
    body: {}
  })
  const payload = JSON.parse(response.payload);
  t.equal(payload?.message, "body must have required property 'name'")
  t.equal(payload?.statusCode, 400)
})

test('Should merge existing schema with common schema', async (t) => {
  t.plan(2)
  const fastify = new Fastify()
  await fastify.register(fastifyCommonSchema, {
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
  })
  fastify.post('/product', {
    handler: (req, res) => res.send(42),
    schema: {
      body: {
        type: 'object',
        properties: {
          surname: {type: 'string'}
        }
      }
    }}
  )

  const response = await fastify.inject({
    method: 'POST',
    url: '/product',
    body: {
      surname: "pippo"
    }
  })
  const payload = JSON.parse(response.payload);
  t.equal(payload?.message, "body must have required property 'name'")
  t.equal(payload?.statusCode, 400)
})

test('Should skip routes not passed in routesToApply', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  await fastify.register(fastifyCommonSchema, {
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
      "unexisting": ['post', 'get', 'patch']
    }
  })
  fastify.post('/product', {
    handler: (req, res) => res.send(42),
    schema: {
      body: {
        type: 'object',
        properties: {
          surname: {type: 'string'}
        }
      }
    }}
  )

  const response = await fastify.inject({
    method: 'POST',
    url: '/product',
    body: {
      surname: "pippo"
    }
  })
  t.equal(response?.statusCode, 200)
})

test('Should skip route method not passed in routesToApply', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  await fastify.register(fastifyCommonSchema, {
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
      "product": ['get', 'patch']
    }
  })
  fastify.post('/product', {
    handler: (req, res) => res.send(42),
    schema: {
      body: {
        type: 'object',
        properties: {
          surname: {type: 'string'}
        }
      }
    }}
  )

  const response = await fastify.inject({
    method: 'POST',
    url: '/product',
    body: {
      surname: "pippo"
    }
  })
  t.equal(response?.statusCode, 200)
})

test('Should merge existing with common using response prop in schema', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  await fastify.register(fastifyCommonSchema, {
    commonSchema: {
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
            otherValue: { type: 'boolean' }
          }
        }
      }
    },
    routesToApply: {
      "product": ['get', 'post']
    }
  })
  fastify.post('/product', {
    handler: (req, res) => res.send({hello: "world", notReturned: true}),
    schema: {
      body: {
        type: 'object',
        properties: {
          surname: {type: 'string'}
        }
      }
    }}
  )
  fastify.get('/product', {
    handler: (req, res) => res.send(true)}
  )

  const response = await fastify.inject({
    method: 'POST',
    url: '/product',
    body: {
      surname: "pippo"
    }
  })
  t.same(JSON.parse(response?.payload), {hello: "world"})
})

test('Should create schema for route if not exists', async (t) => {
  t.plan(1)
  const fastify = new Fastify()
  await fastify.register(fastifyCommonSchema, {
    commonSchema: {
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
            otherValue: { type: 'boolean' }
          }
        }
      }
    },
    routesToApply: {
      "product": ['get', 'post']
    }
  })
  fastify.post('/product', {
    handler: (req, res) => res.send({hello: "world", notReturned: true})
  })

  const response = await fastify.inject({
    method: 'POST',
    url: '/product',
    body: {
      surname: "pippo"
    }
  })
  t.same(JSON.parse(response?.payload), {hello: "world"})
})


