"use client";

import { Button } from "@/src/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { orpc } from "@/src/server/orpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";
import { Dropzone } from "@/src/components/dropzone";

export default function UploadPage() {
  const queryClient = useQueryClient();

  const imagesQuery = useSuspenseQuery(orpc.uploads.list.queryOptions());

  const uploadMutation = useMutation(
    orpc.uploads.create.mutationOptions({
      onSuccess: () => {
        toast.success("File uploaded successfully!");
        queryClient.invalidateQueries({ queryKey: orpc.uploads.list.queryKey() });
      },
    }),
  );

  return (
    <div className="container mx-auto py-10">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const file = formData.get("picture") as File;

          if (file) {
            await uploadMutation.mutateAsync(file);
          }
        }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="picture">Picture</FieldLabel>
            <Input id="picture" name="picture" type="file" accept="image/*" />
          </Field>

          <Button type="submit">Upload</Button>
        </FieldGroup>
      </form>
      <Dropzone />
      <Separator className="my-10" />

      <div>
        <h2 className="mt-8 mb-4 text-lg font-semibold">Uploaded Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagesQuery.data.map((upload) => (
            <Image
              key={upload.id}
              src={upload.url}
              alt={`Upload ${upload.id}`}
              width={300}
              height={300}
              className="w-80 rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}