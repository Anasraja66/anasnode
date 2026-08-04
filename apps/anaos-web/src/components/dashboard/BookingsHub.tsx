"use client";

import { useState, useEffect } from "react";
import { format, isToday, isTomorrow, isPast, isFuture } from "date-fns";
import { Calendar as CalendarIcon, Clock, Phone, MapPin, User, ArrowUpRight, Search, Loader2 } from "lucide-react";

import { InnerPageHeader } from "@/components/ui/InnerPageHeader";

export function BookingsHub() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBookings(data.bookings);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A6BFF]" />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => isFuture(new Date(b.endAt)));
  const pastBookings = bookings.filter(b => isPast(new Date(b.endAt)));

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <InnerPageHeader
        title="Calendar & Bookings"
        subtitle="Manage appointments scheduled by your AI agents."
        icon={CalendarIcon}
        backHref="/dashboard"
        backLabel="Back to dashboard"
      >
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A6BFF]/20 transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-[#0A6BFF] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm shrink-0 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Sync Calendar
          </button>
        </div>
      </InnerPageHeader>

      <div className="max-w-7xl mx-auto space-y-8 font-sans animate-in fade-in duration-300 p-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-zinc-500 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A6BFF] flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className="font-medium">Total Bookings</span>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{bookings.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-zinc-500 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="font-medium">Upcoming</span>
          </div>
          <p className="text-3xl font-bold text-zinc-900">{upcomingBookings.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-zinc-500 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="font-medium">Unique Clients</span>
          </div>
          <p className="text-3xl font-bold text-zinc-900">
            {new Set(bookings.map(b => b.contactPhone)).size}
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-zinc-900">Upcoming Appointments</h2>
        </div>
        
        {upcomingBookings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-1">No upcoming bookings</h3>
            <p className="text-zinc-500 max-w-sm">Your AI hasn't scheduled any new appointments yet. Once they do, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-zinc-50/50 transition-colors flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 bg-blue-50/50 border border-blue-100 rounded-2xl text-[#0A6BFF]">
                  <span className="text-xs font-bold uppercase tracking-wider">{format(new Date(booking.startAt), "MMM")}</span>
                  <span className="text-2xl font-black leading-none mt-1">{format(new Date(booking.startAt), "d")}</span>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900">{booking.title}</h3>
                      <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(booking.startAt), "h:mm a")} - {format(new Date(booking.endAt), "h:mm a")} 
                        {isToday(new Date(booking.startAt)) && <span className="ml-2 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Today</span>}
                        {isTomorrow(new Date(booking.startAt)) && <span className="ml-2 text-xs font-semibold bg-blue-100 text-[#0A6BFF] px-2 py-0.5 rounded-full">Tomorrow</span>}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Confirmed
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-lg text-zinc-700 font-medium">
                      <User className="w-4 h-4 text-zinc-400" />
                      {booking.contactName}
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-lg text-zinc-700 font-medium">
                      <Phone className="w-4 h-4 text-zinc-400" />
                      {booking.contactPhone}
                    </div>
                    {booking.notes && (
                      <div className="flex items-center gap-2 text-zinc-500">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{booking.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pastBookings.length > 0 && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
            <h2 className="font-semibold text-zinc-900">Past Appointments</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {pastBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors opacity-75">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                    <span className="text-[10px] font-bold uppercase">{format(new Date(booking.startAt), "MMM")}</span>
                    <span className="text-lg font-black leading-none">{format(new Date(booking.startAt), "d")}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{booking.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{booking.contactName} • {format(new Date(booking.startAt), "h:mm a")}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-zinc-500 px-2 py-1 bg-zinc-100 rounded-md">Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
