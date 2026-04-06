import { createGlobalStyle } from 'styled-components';

import colors from './variables/colors';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${colors.bgColor};
    color: ${colors.text.light.very};
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body,
  input,
  button {
    font: 15px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  h1, h2, h3 {
    font-family: 'Nunito', 'Inter', sans-serif;
  }

  *:focus {
    outline: 0;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
  }
`;
