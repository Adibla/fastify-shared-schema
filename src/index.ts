import { FastifyInstance, HTTPMethods, RouteOptions } from "fastify";

import { fastifyPlugin } from 'fastify-plugin'

import { isEmptyObject, mergeDeep } from './utils';
import { PluginOptions } from "./types/plugin-options";

const fastifyCommonSchema = async function (fastify: FastifyInstance, options: PluginOptions) {
    const isEmptyRoutesToApply: boolean = options.routesToApply && (isEmptyObject(options.routesToApply));
    const isEmptyCommonSchema: boolean = options.commonSchema && (isEmptyObject(options.commonSchema));

    if(!options.routesToApply || isEmptyRoutesToApply) {
      throw new Error("You must specify routes (in the right format) in which apply common schema!");
    }
    if(!options.commonSchema || isEmptyCommonSchema  ) {
      throw new Error("You must specify common schema (in right format) for your routes!");
    }

    fastify.addHook('onRoute', async (routeOptions: RouteOptions) => {
        try {
            const routeUrlWithNoPrefix: string = routeOptions.url.replace("/","");
            const routeMethod: HTTPMethods | HTTPMethods[] = routeOptions.method;
            const routeIsIncluded: boolean = !Array.isArray(routeMethod) && options.routesToApply[routeUrlWithNoPrefix].includes(routeMethod);
            if(
                options.routesToApply[routeUrlWithNoPrefix] &&
                Array.isArray(options.routesToApply[routeUrlWithNoPrefix]) &&
                routeIsIncluded
            ){
              routeOptions.schema = mergeDeep(routeOptions.schema || {}, options.commonSchema)
            }
            return routeOptions
      }catch (e){
        //In case of any errors return routeOptions in order to avoid exception in route registration
        return routeOptions
      }
    })
}

export default fastifyPlugin(fastifyCommonSchema)
