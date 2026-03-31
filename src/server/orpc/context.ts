import { ORPCError, os } from "@orpc/server";
import { auth } from "@/src/server/auth/auth";

/**
 * Base context with headers, session and user information
 */
export const base = os.$context<{ headers: Headers }>();

/**
 * Middleware to check if the user is authenticated
 */
export const authMiddleware = base.middleware(async ({ context, next }) => {
  const sessionData = await auth.api.getSession({
    headers: context.headers,
  });

  if (!sessionData?.session || !sessionData?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  // Adds session and user to the context
  return next({
    context: {
      session: sessionData.session,
      user: sessionData.user,
    },
  });
});

/**
 * Protected procedure
 */
export const protectedProcedure = base.use(authMiddleware);
