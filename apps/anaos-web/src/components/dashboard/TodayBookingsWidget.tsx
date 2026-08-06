"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, AlertCircle, RefreshCw } from "lucide-react";
import BrandIcon from "../ui/BrandIcon";

type Booking = {
  id: string;
  contactName: string;
  contactPhone: string;
  title: string;
  startAt: string;
  endAt: string;
  status: string;
  channel: string;
};

export default function TodayBookingsWidget() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calendar/bookings?limit=5");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load bookings");
      
      const rawBookings = data.bookings || [];
      if (rawBookings.length > 0) {
        setBookings(rawBookings);
      } else {
        setBookings([]);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Could not sync bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChannelIcon = (channel: string) => {
    return <BrandIcon id={channel} className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex flex-col h-full font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-[#0A6BFF]/10 text-[#0A6BFF] flex items-center justify-center shadow-sm">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-[#111827] tracking-tight leading-none">Today&apos;s Bookings</h3>
            <p className="text-[12px] font-medium text-zinc-500 mt-1">Google Calendar Sync</p>
          </div>
        </div>
        <button
          onClick={fetchBookings}
          className="p-1.5 text-zinc-400 hover:text-[#0A6BFF] hover:bg-[#0A6BFF]/5 rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0A6BFF]' : ''}`} />
        </button>
      </div>

      <div className="flex-1 mt-5 flex flex-col justify-center">
        {loading && bookings.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-[13px] animate-pulse">
            Syncing appointments...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-[12px] flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-[13px] space-y-2">
            <Clock className="w-8 h-8 text-zinc-200 mx-auto" />
            <p className="font-medium text-zinc-600">No appointments scheduled</p>
            <p className="text-[12px] text-zinc-400">AI will list meetings here once booked in chat.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {bookings.map((booking) => (
              <div 
                key={booking.id}
                className="flex items-center justify-between p-3 bg-transparent hover:bg-zinc-50 rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#0A6BFF]/5 flex items-center justify-center shrink-0 text-[#0A6BFF] border border-[#0A6BFF]/10">
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      {booking.contactName.slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#111827] truncate group-hover:text-[#0A6BFF] transition-colors">{booking.contactName}</p>
                    <p className="text-[12px] text-zinc-500 truncate flex items-center gap-1 mt-0.5">
                      {getChannelIcon(booking.channel)}
                      <span>{booking.title}</span>
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-[11px] font-medium">
                    <Clock className="w-3 h-3 text-sky-500" />
                    {formatTime(booking.startAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
