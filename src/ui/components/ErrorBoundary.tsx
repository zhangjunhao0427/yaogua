import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * 兜住渲染时的异常。没有它，任何一处出错都会变成一整片白屏，
 * 用户看不出是程序问题还是自己的卦记没了。
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // 暂时没有上报服务，至少留在控制台，真机可用 Safari 连上来看
    console.error('界面出错：', error, info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
    window.location.hash = '#/';
  };

  override render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="screen">
        <main className="screen__body empty">
          <h1 className="serif ask__title">这一页没能显示出来</h1>
          <p className="muted">
            是程序出了岔子，不是你的卦记丢了。
            <br />
            所有卦记都还在这台设备上，回首页就能继续。
          </p>
          <button type="button" className="btn btn--primary" onClick={this.reset}>
            回首页
          </button>
          <details className="glossary">
            <summary>出错详情</summary>
            <p className="small muted">{error.message}</p>
          </details>
        </main>
      </div>
    );
  }
}
