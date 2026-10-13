import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './home/PatientHome';
import BookingForm from './booking/BookingForm';
import TrackingView from './tracking/TrackingView';
import ReportView from './report/ReportView';
import Profile from './profile/Profile';

export default function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="" element={<Home />} />
          <Route path="book" element={<BookingForm />} />
          <Route path="track/:id" element={<TrackingView />} />
          <Route path="report/:id" element={<ReportView />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}
