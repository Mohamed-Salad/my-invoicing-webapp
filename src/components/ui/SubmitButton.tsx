"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

const SubmitButton = ({ children = "Submit" }: { children?: React.ReactNode }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="relative w-full font-semibold">
      <span className={pending ? "text-transparent" : ""}>{children}</span>
      {pending && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoaderCircle className="h-4 w-4 animate-spin" />
        </span>
      )}
    </Button>
  );
};

export default SubmitButton;
