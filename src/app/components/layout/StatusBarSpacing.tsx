'use client'
import React, { useEffect, useState } from 'react'
import { SafeArea } from 'capacitor-plugin-safe-area'
import { Capacitor } from '@capacitor/core'

export const getStatusBarHeight = async () => {
  const { statusBarHeight } = await SafeArea.getStatusBarHeight()
  return Capacitor.isNativePlatform() ? statusBarHeight : 0 // Ex. 29.090909957885742
}

export const getBottomBarHeight = async () => {
  const {insets} = await SafeArea.getSafeAreaInsets()
  return insets.bottom
}

export const getMarginBottom = async (defaultMargin: number) => {
  const {insets} = await SafeArea.getSafeAreaInsets()
  return Math.round(insets.bottom + defaultMargin)
}

export const getStatusBarHeightClass = (defaultHeight: number, statusBarHeight: number) => {
  const height = statusBarHeight
  return `h-${Math.round((height + 4 * defaultHeight) / 4)}`
}

export const getPaddingTopClass = (defaultMargin: number, statusBarHeight: number) => {
  return `pt-${Math.round((statusBarHeight + 4 * defaultMargin) / 4)}`
}

export const getPaddingTop = async (defaultMargin: number, statusBarHeight?: number) => {
  let height = statusBarHeight || (await getStatusBarHeight())
  if (height) height -= 20 //If device is native (has status bar) the padding is excessive, so reduce by 20px
  return Math.round(height + 4 * defaultMargin)
}

export const getMarginTopClass = (defaultMargin: number, statusBarHeight: number) => {
  const height = `mt-[${statusBarHeight + 4 * defaultMargin}px]`
  return height
}

export const getMarginTop = async (defaultMargin: number, statusBarHeight?: number) => {
  let height = statusBarHeight || (await getStatusBarHeight())
  if (height) height -= 20 //If device is native (has status bar) the padding is excessive, so reduce by 20px
  return Math.round(height + defaultMargin)
}

type Props = {}

const StatusBarSpacing = (props: Props) => {
  const [heightClass, setHeightClass] = useState('')

  useEffect(() => {
    async function getHeight() {
      const height = await getStatusBarHeight()
      setHeightClass(getStatusBarHeightClass(0, height))
    }

    getHeight()
  }, [])

  return <div className={heightClass} />
}

export default StatusBarSpacing
