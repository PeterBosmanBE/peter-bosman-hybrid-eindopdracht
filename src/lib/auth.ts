import { betterAuth } from "better-auth";
import { captcha } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/index";
import * as schema from "@/src/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        },
        discord: { 
            clientId: process.env.DISCORD_CLIENT_ID as string, 
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string, 
        },
    },
    plugins: [ 
        captcha({ 
            provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
            secretKey: process.env.TURNSTILE_SECRET_KEY!, 
        }), 
    ], 
});