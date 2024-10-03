import React from 'react';

type Props = {
  content: string;
};

export const BreakLineDiv = ({ content }: Props) => {
  return (
    <>
      {content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </>
  );
};
