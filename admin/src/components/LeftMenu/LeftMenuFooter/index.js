/**
 *
 * LeftMenuFooter
 *
 */

import React from 'react';
import Wrapper, { A } from './Wrapper';

function LeftMenuFooter({ version }) {
  // PROJECT_TYPE is an env variable defined in the webpack config
  // eslint-disable-next-line no-undef
  const projectType = PROJECT_TYPE;

  return (
    <Wrapper>
      <div className="poweredBy">
        <span>Powered By - </span>
        <A key="website" href="https://reactavancado.com.br" target="_blank" rel="noopener noreferrer">
          React Avançado
        </A>
      </div>
    </Wrapper>
  );
}

export default LeftMenuFooter;
