import React from "react";
import { Container } from "react-bootstrap";

export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /*  componentDidCatch(error: any, errorInfo: any) {
      // You can also log the error to an error reporting service
      logErrorToMyService(error, errorInfo);
    } */

  render() {
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return (
        <Container className="pt-4">
          <h1 className="text-light">
            {(this.props as any).message
              ? (this.props as any).message
              : "Something went wrong...:("}
          </h1>
        </Container>
      );
    }

    return this.props.children;
  }
}
