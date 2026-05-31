import OrderForm from "@/components/order-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ওয়েবসাইট অর্ডার ফর্ম</CardTitle>
          <CardDescription>
            আপনার ওয়েবসাইট তৈরির জন্য প্রয়োজনীয় তথ্যগুলো দিন। (* চিহ্নিত ঘরগুলো
            বাধ্যতামূলক)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderForm />
        </CardContent>
      </Card>
    </main>
  )
}
