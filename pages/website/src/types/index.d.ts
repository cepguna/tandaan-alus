import type { PropsAppLayout } from '@src/components/layouts/app-layout';

export interface ILayout {
  title: string;
  exact?: boolean;
  path: string;
  component: any;
  layout: PropsAppLayout['layout'];
}
