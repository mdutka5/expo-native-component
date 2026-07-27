import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';

export type Props = ViewProps & {};

const NativeView: React.ComponentType<Props> = requireNativeViewManager('AnimatedIOSClockView');

export default function AnimatedIOSClockView(props: Props) {
  return <NativeView {...props} />;
}
