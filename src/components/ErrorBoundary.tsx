import { Component, type ReactNode } from "react";
import { ERROR_PAGE } from "../text/pages";

/** Stops one broken page from blanking the whole site. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="wrap page-pad">
        <section>
          <h2>{ERROR_PAGE.title}</h2>
          <p className="lead">{ERROR_PAGE.text}</p>
          <button className="btn primary" onClick={() => window.location.reload()}>{ERROR_PAGE.button}</button>
        </section>
      </div>
    );
  }
}
