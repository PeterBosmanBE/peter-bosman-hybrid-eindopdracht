"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/src/server/auth/auth-client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "../ui/label";
import Image from "next/image";

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Display name is required")
    .regex(
      /^[\p{L}\p{N} ]+$/u,
      "Display name can only contain letters, numbers, and spaces. Emojis and special characters are not allowed.",
    ),
  image: z.union([
    z.literal(""),
    z.string().url("Profile picture must be a valid URL."),
  ]),
  bio: z
    .string()
    .regex(
      /^[\p{L}\p{N} ]+$/u,
      "Display name can only contain letters, numbers, and spaces. Emojis and special characters are not allowed.",
    )
    .optional(),
});

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const [linkedAccounts, setLinkedAccounts] = useState<
    { providerId: string }[]
  >([]);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
      setBio(session.user.bio || "");

      // Fetch user's connected accounts (e.g. Google, GitHub)
      if (typeof authClient.listAccounts === "function") {
        authClient
          .listAccounts()
          .then((res) => {
            if (res?.data) {
              setLinkedAccounts(res.data);
            }
          })
          .catch((err) =>
            console.error("Failed to fetch linked accounts:", err),
          );
      }
    }
  }, [session]);

  const handleSave = async () => {
    const result = profileSchema.safeParse({ name, image, bio });
    if (!result.success) {
      const fieldErrors: { name?: string; image?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === "name") fieldErrors.name = err.message;
        if (err.path[0] === "image") fieldErrors.image = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      setIsSaving(true);
      await authClient.updateUser({
        name: result.data.name,
        image: result.data.image || undefined,
        bio: result.data.bio || undefined,
      });

      toast.success("Profile updated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-12 text-[#666666]">
        Loading profile...
      </div>
    );
  }

  // Get unique provider IDs to display
  const providers = Array.from(
    new Set(linkedAccounts.map((acc) => acc.providerId)),
  );

  return (
    <div className="max-w-2xl mx-auto md:py-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#232F3E" }}>
        Edit Profile
      </h1>

      <div
        className="space-y-6 bg-white p-6 rounded-xl border"
        style={{ borderColor: "#E8E8E8" }}
      >
        <p className="text-sm text-gray-500 mb-6">
          Update your public profile details. Changes will be reflected across
          your creator page.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar preview */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border bg-[#FAFAF8]"
            style={{ borderColor: "#E8E8E8" }}
          >
            {image && !errors.image ? (
              <Image
                width={100}
                height={100}
                src={image}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#666666] text-3xl font-semibold">
                {name ? name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 mt-6">
          <Label
            className="text-sm font-semibold uppercase"
            style={{ color: "#666666" }}
          >
            Display Name
          </Label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Your name"
            className={
              errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.name && (
            <p className="text-xs mt-1 text-red-500 font-medium">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            className="text-sm font-semibold uppercase block mb-1"
            style={{ color: "#666666" }}
          >
            Bio
          </Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your listeners about yourself..."
            rows={4}
          />
        </div>

        {/* Connected Accounts Section */}
        {providers.length > 0 && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{ background: "#FAFAF8", border: "1px solid #E8E8E8" }}
          >
            <p
              className="text-sm font-semibold mb-2"
              style={{ color: "#232F3E" }}
            >
              Connected Accounts
            </p>
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <span
                  key={provider}
                  className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E8E8",
                    color: "#666666",
                  }}
                >
                  {provider}
                </span>
              ))}
            </div>
          </div>
        )}

        <div
          className="pt-4 flex justify-end gap-3 border-t mt-6"
          style={{ borderColor: "#E8E8E8", paddingTop: "1.5rem" }}
        >
          <Button
            variant="outline"
            onClick={() => {
              setName(session?.user?.name || "");
              setImage(session?.user?.image || "");
              setBio(session?.user?.bio || "");
              setErrors({});
            }}
            disabled={isSaving}
          >
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            style={{ background: "#F7941D", color: "white" }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
