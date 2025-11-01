
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {CirclePlus} from 'lucide-react'
import Link from "next/link"
import {Label} from "@/components/ui/label"
import{Input} from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  return (
      <main className="flex flex-col justify-center h-full gap-6 max-w-5xl mx-auto my-12" >
       <div className="flex justify-between"> 
        <h1 className="text-3xl font-bold">
         Create an Invoice
        </h1>
        <form>
          <div>
            <Label className="block font-semibold text-small mb-2">
              Billing Name
            </Label>
            <Input type="text" />
          </div>
          <div>
            <Label className="block font-semibold text-small mb-2">
              Billing Email
            </Label>
            <Input type="text" />
          </div>
          <div>
            <Label className="block font-semibold text-small mb-2">
              Value
            </Label>
            <Input type="text" />
          </div>
          <div>
            <Label className="block font-semibold text-small mb-2">
              Description
            </Label>
            <Textarea></Textarea>
          </div>
        </form>
       </div>
        
      </main>
  );
}
