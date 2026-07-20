import { inventory } from "@/lib/data";

export default function AdminPage() {
  return (
    <div className="px-margin-desktop py-xl bg-surface min-h-screen">
      <div className="mb-lg border-b-2 border-on-tertiary-fixed pb-sm">
        <h1 className="font-display-xl text-[48px] uppercase leading-none text-on-surface">
          Admin Dashboard (Preview)
        </h1>
        <p className="font-body-lg text-on-surface-variant mt-xs">
          This is a static preview. In the full version, this dashboard will connect to Supabase to manage inventory and view booking requests.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Inventory Table Preview */}
        <div className="hard-border bg-surface-container-low p-md">
          <h2 className="font-headline-lg-mobile text-[24px] uppercase border-b-2 border-on-tertiary-fixed pb-sm mb-md">Inventory Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md">
              <thead>
                <tr className="border-b-2 border-outline-variant">
                  <th className="p-xs font-label-caps uppercase">Item</th>
                  <th className="p-xs font-label-caps uppercase">Category</th>
                  <th className="p-xs font-label-caps uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 5).map(item => (
                  <tr key={item.id} className="border-b border-outline-variant/50">
                    <td className="p-xs">{item.name}</td>
                    <td className="p-xs">{item.category}</td>
                    <td className="p-xs text-primary font-bold">Available</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Requests Preview */}
        <div className="hard-border bg-surface-container-low p-md">
          <h2 className="font-headline-lg-mobile text-[24px] uppercase border-b-2 border-on-tertiary-fixed pb-sm mb-md">Recent Booking Requests</h2>
          <div className="flex flex-col gap-sm">
             <div className="p-sm bg-surface-bright border border-outline-variant">
                <div className="flex justify-between font-label-caps uppercase mb-xs">
                  <span>Req #001 - Budi</span>
                  <span className="text-error">Pending</span>
                </div>
                <div className="font-body-md text-sm">
                  1x Sony FX6 (12-Oct to 14-Oct)
                </div>
             </div>
             <div className="p-sm bg-surface-bright border border-outline-variant">
                <div className="flex justify-between font-label-caps uppercase mb-xs">
                  <span>Req #002 - Andi</span>
                  <span className="text-primary">Confirmed</span>
                </div>
                <div className="font-body-md text-sm">
                  1x RED Komodo, 1x Godox AD200 (15-Oct)
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
