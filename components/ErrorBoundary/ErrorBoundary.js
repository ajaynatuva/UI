import React, { Component } from "react";
import "../../components/ErrorBoundary/ErrorBoundary.css";
import { withRouter } from "./withRouter";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  static componentDidUpdate(prevProps,prevState){
    if(prevProps.location !== this.props.location){
      this.setState({hasError:false})
    }
    return null;
  }
  componentDidCatch(error, info) {
    // You can log the error to an error reporting service here
    console.error("Error caught by ErrorBoundary:", error, info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <h3 className="contentMsg">
          Something Issue in the Component Please contact IT Team
        </h3>
      );
    }
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
