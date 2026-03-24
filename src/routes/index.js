import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Exercises from '../pages/Exercises';
import Placeholder from '../pages/Placeholder';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/workouts" element={<Placeholder title="Workouts" />} />
      <Route path="/habits" element={<Placeholder title="Habits" />} />
      <Route path="/health" element={<Placeholder title="Health Profile" />} />
      <Route path="/calendar" element={<Placeholder title="Calendar View" />} />
    </Routes>
  );
}
