   "use client";
   import { useFormStatus } from "react-dom";
   import { Button } from "@/components/ui/button"
   import { LoaderCircle } from "lucide-react";
   const SubmitButton = () => {
     const { pending } = useFormStatus();
     console.log(
      'pending', pending
     );
    return(
    <Button  className=" relative w-full font-semibold">
          <span className={pending ? 
            'text-transparent ': ''
          }>Submit</span>
          <span className = "flex items-center justify-center w-full h-full absolute text-gray-400">
          {pending &&
            <LoaderCircle className="absolute animate-spin" />}
            </span>
        </Button>
    )
    }
    export default SubmitButton;