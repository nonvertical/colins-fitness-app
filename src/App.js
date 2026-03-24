import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';

import GlobalStyles from './assets/styles/global';
import colors from './assets/styles/variables/colors';
import metrics from './assets/styles/variables/metrics';
import Navigation from './components/Navigation';
import Routes from './routes';

const AppContainer = styled.div`
  display: flex;
  height: 100%;
  background: ${colors.bgColor};
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  min-height: 100%;

  @media (min-width: 769px) {
    margin-left: ${metrics.sidebarWidth};
  }
`;

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <AppContainer>
        <Navigation />
        <MainContent>
          <Routes />
        </MainContent>
      </AppContainer>
    </BrowserRouter>
  );
}
