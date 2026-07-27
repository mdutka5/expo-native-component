import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';

export type Props = ViewProps & {
  value?: number;
};

const NativeView: React.ComponentType<Props> = requireNativeViewManager(
  'ContentTransitionTextView'
);

export default function ContentTransitionTextView(props: Props) {
  return <NativeView {...props} />;
}
