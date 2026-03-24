import React from 'react';
import styled from 'styled-components';
import colors from '../../assets/styles/variables/colors';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60vh;
  color: ${colors.text.light.medium};
  font-size: 16px;
`;

export default function Home() {
  return <Container>Home — coming soon</Container>;
}
