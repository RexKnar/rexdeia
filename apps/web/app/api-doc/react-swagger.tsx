'use client';

import 'swagger-ui-react/swagger-ui.css';

import SwaggerUI from 'swagger-ui-react';

type Props = {
  spec: Record;
};

function ReactSwagger({ spec }: Props) {
  // @ts-ignore - SwaggerUI is not typed
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;
