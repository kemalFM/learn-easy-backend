import React, { Component } from 'react';

export class App extends React.Component {
    render() {
      const { isMobile } = this.props;
  
      return (
        <div>
          <h1>hello world {isMobile ? 'mobile' : 'desktop'}</h1>
        </div>
      );
    }
  }