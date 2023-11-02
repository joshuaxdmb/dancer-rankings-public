'use client'
import { RecoilRoot } from 'recoil';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function RecoilProvider({ children}: Props) {
  return <RecoilRoot>{children}</RecoilRoot>;
}