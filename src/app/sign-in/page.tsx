import SignInSocials from "@/src/components/sign-in-socials";

export default function SocialLogin() {
  return (
    <div>
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="gap-3">
          <SignInSocials name={"GitHub"} provider="github" icon="github" />
        </div>
      </section>
    </div>
  );
}
