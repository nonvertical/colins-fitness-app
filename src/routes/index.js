import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Exercises from '../pages/Exercises';
import Workouts from '../pages/Workouts';
import Habits from '../pages/Habits';
import HealthProfile from '../pages/HealthProfile';
import Placeholder from '../pages/Placeholder';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/health" element={<HealthProfile />} />
      <Route path="/calendar" element={<Placeholder title="Calendar View" />} />
    </Routes>
  );
}
