import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cls } from '../cls';

interface ScreenProps {
  /** 不传则不显示顶栏 */
  title?: string;
  back?: string;
  className?: string;
  children?: ReactNode;
}

export function Screen({ title, back = '/', className, children }: ScreenProps) {
  return (
    <div className={cls('screen', className)}>
      {title !== undefined && (
        <header className="topbar">
          <Link to={back} className="topbar__back" aria-label="返回">
            ‹
          </Link>
          <h1 className="topbar__title">{title}</h1>
          <span aria-hidden="true" />
        </header>
      )}
      <main className="screen__body">{children}</main>
    </div>
  );
}
