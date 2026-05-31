import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/logout-button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  return (
    <div>
      <header className="flex h-14 items-center justify-between border-b px-4">
        <span className="font-semibold">অ্যাডমিন প্যানেল</span>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  )
}
