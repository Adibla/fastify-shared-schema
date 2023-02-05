import Fastify from 'fastify'
import fastifySharedSchema from '../dist'

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
      'product': ["POST"]
    }
  });

  fastify.post("/test", {
    handler: async (req,res) => {
      return res.send({hello:"world"})
    },
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            value: { type: 'string' },
            otherValue: { type: 'boolean' }
          }
        }
      },
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
