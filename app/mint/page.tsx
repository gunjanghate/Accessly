'use client';
import { useSearchParams } from 'next/navigation';
import { events } from '@/lib/event';
import { useEffect, useState } from 'react';

export default function MintPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    seatNumber: '',
    price: '',
    bannerImage: null,
    tokenURI: '',
  });

  useEffect(() => {
    const selectedEvent = events.find((e) => e.id.toString() === eventId);
    if (selectedEvent) {
      setFormData({
        eventName: selectedEvent.eventName,
        eventDate: selectedEvent.date,
        venue: selectedEvent.venue,
        seatNumber: selectedEvent.seatNumber,
        price: selectedEvent.price,
        bannerImage: null,
        tokenURI: '',
      });
    }
  }, [eventId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mint Ticket for: {formData.eventName || 'Event'}</h1>

      {/* 🧾 Include your actual mint form component here */}
      {/* Pass formData + setFormData as props if the form is in a separate component */}
    </div>
  );
}
