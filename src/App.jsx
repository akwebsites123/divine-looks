import { useState, useCallback } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import SlotsUnavailable from "./pages/SlotsUnavailable.jsx";

// View router — no react-router, just state.
// views: "landing" | "booking" | "confirmation" | "unavailable"
export default function App() {
  const [view, setView] = useState("landing");
  const [preselectedServiceId, setPreselectedServiceId] = useState(null);
  const [booking, setBooking] = useState(null); // confirmed booking payload
  const [unavailableCtx, setUnavailableCtx] = useState(null); // { service, date }
  const [bookingResume, setBookingResume] = useState(null); // resume state for BookingPage

  const goToBooking = useCallback((serviceId = null) => {
    setPreselectedServiceId(serviceId);
    setBookingResume(null);
    setView("booking");
    window.scrollTo(0, 0);
  }, []);

  const goToLanding = useCallback(() => {
    setView("landing");
    window.scrollTo(0, 0);
  }, []);

  const goToConfirmation = useCallback((payload) => {
    setBooking(payload);
    setView("confirmation");
    window.scrollTo(0, 0);
  }, []);

  const goToUnavailable = useCallback((service, date) => {
    setUnavailableCtx({ service, date });
    setView("unavailable");
    window.scrollTo(0, 0);
  }, []);

  // "Try another date" — back to booking step 2 with same service, next day
  const resumeBookingNextDate = useCallback((service, fromDate) => {
    const next = new Date(fromDate);
    next.setDate(next.getDate() + 1);
    setBookingResume({ serviceId: service.id, step: 2, date: next });
    setPreselectedServiceId(service.id);
    setView("booking");
    window.scrollTo(0, 0);
  }, []);

  // "Choose a different service" — booking step 1, nothing selected
  const restartBooking = useCallback(() => {
    setPreselectedServiceId(null);
    setBookingResume(null);
    setView("booking");
    window.scrollTo(0, 0);
  }, []);

  if (view === "booking")
    return (
      <BookingPage
        preselectedServiceId={preselectedServiceId}
        resume={bookingResume}
        onBack={goToLanding}
        onConfirmed={goToConfirmation}
        onAllSlotsBooked={goToUnavailable}
      />
    );

  if (view === "confirmation")
    return (
      <ConfirmationPage booking={booking} onBookAnother={restartBooking} />
    );

  if (view === "unavailable")
    return (
      <SlotsUnavailable
        service={unavailableCtx?.service}
        date={unavailableCtx?.date}
        onTryAnotherDate={resumeBookingNextDate}
        onChooseDifferentService={restartBooking}
      />
    );

  return <LandingPage onBook={goToBooking} />;
}
