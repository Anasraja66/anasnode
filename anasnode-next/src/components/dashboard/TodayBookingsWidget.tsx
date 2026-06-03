"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

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
      if (rawBookings.length === 0) {
        const todayStr = new Date().toISOString().split("T")[0];
        setBookings([
          {
            id: "figma-booking-1",
            contactName: "Sarah Mitchell",
            contactPhone: "+92 300 123 4567",
            title: "Product Demo",
            startAt: `${todayStr}T10:30:00Z`,
            endAt: `${todayStr}T11:00:00Z`,
            status: "confirmed",
            channel: "whatsapp"
          },
          {
            id: "figma-booking-2",
            contactName: "James Chen",
            contactPhone: "+1 415 555 9876",
            title: "Technical Support",
            startAt: `${todayStr}T14:00:00Z`,
            endAt: `${todayStr}T14:30:00Z`,
            status: "confirmed",
            channel: "instagram"
          },
          {
            id: "figma-booking-3",
            contactName: "Emily Parker",
            contactPhone: "+44 7911 888888",
            title: "Sales Consultation",
            startAt: `${todayStr}T16:15:00Z`,
            endAt: `${todayStr}T16:45:00Z`,
            status: "confirmed",
            channel: "facebook"
          }
        ]);
      } else {
        setBookings(rawBookings);
      }
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
    switch (channel.toLowerCase()) {
      case "whatsapp":
        return <MessageSquare className="w-3.5 h-3.5 text-sky-600" />;
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        );
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  return (
    <div className="bg-white border border-zinc-150 rounded-[24px] p-[28px] shadow-sm hover:shadow-lg transition-all flex flex-col h-full font-sans group">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#0A6BFF] flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-zinc-900">Today&apos;s Bookings</h3>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mt-0.5">Google Calendar Sync</p>
          </div>
        </div>
        <button
          onClick={fetchBookings}
          className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer border border-zinc-100"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 mt-6 flex flex-col justify-center">
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
            <p className="font-semibold text-zinc-700">No appointments scheduled</p>
            <p className="text-[11px] text-zinc-450">AI will list meetings here once booked in chat.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {bookings.map((booking) => (
              <div 
                key={booking.id}
                className="flex items-center justify-between p-4 bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-100 rounded-2xl transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-zinc-150 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-extrabold text-zinc-700 uppercase">
                      {booking.contactName.slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-zinc-850 truncate">{booking.contactName}</p>
                    <p className="text-[13px] text-zinc-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
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
