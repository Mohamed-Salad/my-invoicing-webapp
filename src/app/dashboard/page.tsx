import {db} from "@/db"
import { Invoices } from "@/db/schema"
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
export default async function Home() {
  const results = await db.select().from(Invoices)
  console.log('results', results)
  return (
      <main className="flex flex-col justify-center h-full text-center gap-6 max-w-5xl mx-auto my-12" >
       <div className="flex justify-between"> 
        <h1 className="text-3xl font-bold">
          Invoices
        </h1>
        <p>
          <Button className="inline-flex gap-2" variant="ghost" asChild>
            <Link href="/invoices/new">
            Create Invoices
            <CirclePlus className="h-4 w-4"/>
            </Link>
          </Button>
        </p>
        </div>
          <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px] p-4">
        Dates
      </TableHead>
      <TableHead className="p-4">
        Customer
      </TableHead>
      <TableHead className="p-4">
        Email
      </TableHead>
      <TableHead className="text-center p-4">
        Status
      </TableHead>
      <TableHead className="text-right p-4">
        Value
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {results.map(results => {
      return( <TableRow key= {results.id}>
      <TableCell className="p-4 font-medium text-left">
        <span className="font-semibold">
        {new Date(results.createTS).toLocaleDateString()}
        </span>
      </TableCell>
      <TableCell className="p-4 text-left">
        <span>
          Mahamud.M
        </span>
      </TableCell>
      <TableCell className="p-4 text-left">
        <span className="font-semibold">
          MahamudM01@example.com
        </span>
      </TableCell>
      <TableCell className="p-4 text-center">
        <Badge className="rounded-full">
          {results.status}
        </Badge>
      </TableCell>
      <TableCell className="p-4 text-right">
        <span className="font-semibold">
          ${(results.value / 100).toFixed(2)}
        </span>
        </TableCell>
    </TableRow>)
    })}
   
  </TableBody>
</Table>
        
      </main>
  );
}
