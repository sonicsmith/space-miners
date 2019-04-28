import React, { Component } from "react"

import "./Background.css"

class Background extends Component {
  render() {
    return (
      <div className="app">
        {this.props.children}
        <div className="sky">
          <div className="background-left" />
          <div className="background-right" />
          <div className="sun" />
        </div>
        <div className="ground">
          <div className="wave vertical middle wave-0" />
          <div className="wave vertical left wave-0" />
          <div className="wave vertical left wave-1" />
          <div className="wave vertical left wave-2" />
          <div className="wave vertical left wave-3" />
          <div className="wave vertical left wave-4" />
          <div className="wave vertical left wave-5" />
          <div className="wave vertical right wave-0" />
          <div className="wave vertical right wave-1" />
          <div className="wave vertical right wave-2" />
          <div className="wave vertical right wave-3" />
          <div className="wave vertical right wave-4" />
          <div className="wave vertical right wave-5" />
          <div className="wave horizontal left wave-10" />
          <div className="wave horizontal left wave-11" />
          <div className="wave horizontal left wave-12" />
          <div className="wave horizontal left wave-13" />
          <div className="wave horizontal left wave-14" />
          <div className="wave horizontal left wave-15" />
          <div className="wave horizontal left wave-16" />
          <div className="wave horizontal left wave-17" />
          <div className="wave horizontal left wave-18" />
          <div className="wave horizontal left wave-19" />
          <div className="wave horizontal right wave-10" />
          <div className="wave horizontal right wave-11" />
          <div className="wave horizontal right wave-12" />
          <div className="wave horizontal right wave-13" />
          <div className="wave horizontal right wave-14" />
          <div className="wave horizontal right wave-15" />
          <div className="wave horizontal right wave-16" />
          <div className="wave horizontal right wave-17" />
          <div className="wave horizontal right wave-18" />
          <div className="wave horizontal right wave-19" />
        </div>
      </div>
    )
  }
}

export default Background
