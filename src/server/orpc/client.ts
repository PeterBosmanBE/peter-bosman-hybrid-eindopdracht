import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { router } from "@/src/server/orpc/router";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
  url: `${typeof window !== "undefined" ? window.location.origin : process.env.BASE_URL}/api/rpc`,
});

export const client: RouterClient<typeof router> = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);