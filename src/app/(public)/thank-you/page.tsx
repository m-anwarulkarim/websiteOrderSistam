import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ThankYouPage() {
  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">ধন্যবাদ! ✅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            আপনার তথ্য সফলভাবে জমা হয়েছে। আমরা শীঘ্রই WhatsApp-এ যোগাযোগ করব।
          </p>
          <Link href="/" className="text-sm text-primary underline">
            হোমে ফিরে যান
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
