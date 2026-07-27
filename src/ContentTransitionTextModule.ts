import { NativeModule, requireNativeModule } from 'expo';

declare class ContentTransitionTextModule extends NativeModule<{}> {}

export default requireNativeModule<ContentTransitionTextModule>('ContentTransitionText');
