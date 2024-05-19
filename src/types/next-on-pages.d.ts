/// <reference types="@cloudflare/workers-types" />

declare module '@cloudflare/next-on-pages' {
  declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface CloudflareEnv {}
  }
  type RequestContext<
    CfProperties extends Record<string, unknown> = IncomingRequestCfProperties,
    Context = ExecutionContext
  > = {
    env: CloudflareEnv
    cf: CfProperties
    ctx: Context
  }
  export declare function getOptionalRequestContext<
    CfProperties extends Record<string, unknown> = IncomingRequestCfProperties,
    Context = ExecutionContext
  >(): undefined | RequestContext<CfProperties, Context>
  export declare function getRequestContext<
    CfProperties extends Record<string, unknown> = IncomingRequestCfProperties,
    Context = ExecutionContext
  >(): RequestContext<CfProperties, Context>
  export {}
}
