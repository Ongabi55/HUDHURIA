// Lazy Prisma client loader with clear fallback when @prisma/client is missing
// Allows the dev server to start even if Prisma client hasn't been generated yet.

type AnyFn = (...args: any[]) => any

function createMissingPrismaProxy() {
  const handler: ProxyHandler<any> = {
    get(_, prop) {
      throw new Error(
        `Prisma client is not available. Run \"npx prisma generate\" and restart the dev server. Accessed property: ${String(prop)}`
      )
    },
    apply() {
      throw new Error('Prisma client is not available. Run "npx prisma generate" and restart the dev server.')
    }
  }
  return new Proxy({}, handler)
}

let prismaInstance: any = undefined

function getPrisma() {
  if (prismaInstance) return prismaInstance
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client')
    prismaInstance = new PrismaClient()
    return prismaInstance
  } catch (err) {
    // PrismaClient not installed/generated yet — return proxy that throws on use
    prismaInstance = createMissingPrismaProxy()
    return prismaInstance
  }
}

// Export a proxy object so other modules can import { prisma } and access methods lazily
export const prisma: any = new Proxy(
  {},
  {
    get(target, prop) {
      const client = getPrisma()
      // If client is the throwing proxy, accessing any prop will throw with a clear message
      // Otherwise forward the property access to the real Prisma client
      return (client as any)[prop as any]
    },
    apply(target, thisArg, args) {
      const client = getPrisma()
      return (client as AnyFn).apply(thisArg, args)
    }
  }
)

export default prisma
