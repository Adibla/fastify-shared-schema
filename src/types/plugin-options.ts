import {FastifySchema, HTTPMethods} from "fastify";

export type RoutesToApply = {
    [routeName: string]: HTTPMethods[]
}

export type PluginOptions = {
    routesToApply: RoutesToApply,
    commonSchema: FastifySchema
}
