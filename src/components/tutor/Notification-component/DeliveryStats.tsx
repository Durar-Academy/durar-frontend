// components/DeliveryStats.tsx

export default function DeliveryStats() {
  const data = {
    delivered: 9,
    read: 78,
    total: 2456,
    success: 2400,
    readCount: 1916,
    pending: 49,
  };

  return (
    <section className="flex flex-col gap-3 col-span-1">
      <div className="rounded-xl border p-4 w-full max-w-sm space-y-4 shadow-sm">
        <h2 className="font-semibold text-lg">Delivery Statistics</h2>

        {/* Delivered Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
            <span>Delivered</span>
            <span>{data.delivered}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4ACA67]"
              style={{ width: `${data.delivered}%` }}
            />
          </div>
        </div>

        {/* Read Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
            <span>Read</span>
            <span>{data.read}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange"
              style={{ width: `${data.read}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-1 text-sm text-low">
          <div className="flex justify-between">
            <span>Total Recipients</span>
            <span className="text-black font-medium">
              {data.total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Successfully Delivered</span>
            <span className="text-black font-medium">
              {data.success.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Read</span>
            <span className="text-black font-medium">
              {data.readCount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Pending</span>
            <span className="text-black font-medium">{data.pending}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4 w-full max-w-sm space-y-4 shadow-sm">
        <h2 className="font-semibold text-lg">Delivery Statistics</h2>

        {/* Stats */}
        <div className="space-y-1 text-sm text-low">
          <div className="flex justify-between">
            <span>First Year Students</span>
            <span className="text-black font-medium">
              {data.total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Second Year Students</span>
            <span className="text-black font-medium">
              {data.success.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Third Year Students</span>
            <span className="text-black font-medium">
              {data.readCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
