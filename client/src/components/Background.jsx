import React, { Component } from "react"

import "./Background.css"

class Background extends Component {
  render() {
    return (
      <div class="app">
        {this.props.children}
        <div class="sky">
          <div class="background-left" />
          <div class="background-right" />
          <div class="sun" />
        </div>
        <div class="ground">
          <div class="wave vertical middle wave-0" />
          <div class="wave vertical left wave-0" />
          <div class="wave vertical left wave-1" />
          <div class="wave vertical left wave-2" />
          <div class="wave vertical left wave-3" />
          <div class="wave vertical left wave-4" />
          <div class="wave vertical left wave-5" />
          <div class="wave vertical right wave-0" />
          <div class="wave vertical right wave-1" />
          <div class="wave vertical right wave-2" />
          <div class="wave vertical right wave-3" />
          <div class="wave vertical right wave-4" />
          <div class="wave vertical right wave-5" />
          <div class="wave horizontal left wave-10" />
          <div class="wave horizontal left wave-11" />
          <div class="wave horizontal left wave-12" />
          <div class="wave horizontal left wave-13" />
          <div class="wave horizontal left wave-14" />
          <div class="wave horizontal left wave-15" />
          <div class="wave horizontal left wave-16" />
          <div class="wave horizontal left wave-17" />
          <div class="wave horizontal left wave-18" />
          <div class="wave horizontal left wave-19" />
          <div class="wave horizontal right wave-10" />
          <div class="wave horizontal right wave-11" />
          <div class="wave horizontal right wave-12" />
          <div class="wave horizontal right wave-13" />
          <div class="wave horizontal right wave-14" />
          <div class="wave horizontal right wave-15" />
          <div class="wave horizontal right wave-16" />
          <div class="wave horizontal right wave-17" />
          <div class="wave horizontal right wave-18" />
          <div class="wave horizontal right wave-19" />
        </div>
      </div>
    )
  }
}

export default Background
