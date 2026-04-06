import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Exercises from '../pages/Exercises';
import Workouts from '../pages/Workouts';
import Habits from '../pages/Habits';
import HabitDetail from '../pages/Habits/HabitDetail';
import HealthProfile from '../pages/HealthProfile';
import Placeholder from '../pages/Placeholder';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/habits/:id" element={<HabitDetail />} />
      <Route path="/health" element={<HealthProfile />} />
      <Route path="/calendar" element={<Placeholder title="Calendar View" />} />
    </Routes>
  );
}
