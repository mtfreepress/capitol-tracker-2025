import React from 'react';
import Image from 'next/image';

const Portrait = ({ image, alt, width }) => {
  const maxWidth = width || 150;

  return (
    <div style={{ maxWidth: `${maxWidth}px` }}>
      <Image
        src={image}
        alt={alt}
        width={maxWidth}
        height={maxWidth}
        style={{
          objectFit: 'cover',
          objectPosition: '50% 50%'
        }}
      />
    </div>
  );
};

export default Portrait;
