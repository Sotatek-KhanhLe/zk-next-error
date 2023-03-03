'use client';

import React from 'react';
import { useAppSelector } from '@/store';
import { getExampleState } from '@/store/slices';
import { useEffect } from 'react';

type Props = {};

function Testing({}: Props) {
  const exampleState = useAppSelector(getExampleState);

  useEffect(() => {
    console.log('🚀 ~ file: page.tsx:14 ~ Home ~ exampleState', exampleState);
  }, [exampleState]);

  return <div>Testing</div>;
}

export default Testing;
