import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import DojoLogo from '../DojoLogo';
import {
  Sidebar,
  AppName,
  AppNameText,
  NavLink,
  NavIcon,
  MobileFAB,
  Backdrop,
  MobileSheet,
  MobileNavLink,
  MobileNavIcon,
} from './styles';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '⌂' },
  { path: '/exercises', label: 'Exercises', icon: '🏋️' },
  { path: '/workouts', label: 'Workouts', icon: '📋' },
  { path: '/habits', label: 'Habits', icon: '✓' },
  { path: '/health', label: 'Health Profile', icon: '♥' },
  { path: '/calendar', label: 'Calendar', icon: '◫' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* Desktop sidebar */}
      <Sidebar>
        <AppName>
          <DojoLogo size={36} />
          <AppNameText>Dojo</AppNameText>
        </AppName>
        {NAV_ITEMS.map(({ path, label, icon }) => (
          <NavLink key={path} to={path} $active={pathname === path}>
            <NavIcon $active={pathname === path}>{icon}</NavIcon>
            {label}
          </NavLink>
        ))}
      </Sidebar>

      {/* Mobile FAB */}
      <MobileFAB onClick={() => setMobileOpen((o) => !o)} aria-label="Navigation">
        {mobileOpen ? '✕' : '≡'}
      </MobileFAB>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <Backdrop onClick={close} />
          <MobileSheet>
            {NAV_ITEMS.map(({ path, label, icon }) => (
              <MobileNavLink key={path} to={path} $active={pathname === path} onClick={close}>
                <MobileNavIcon>{icon}</MobileNavIcon>
                {label}
              </MobileNavLink>
            ))}
          </MobileSheet>
        </>
      )}
    </>
  );
}
