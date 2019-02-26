import React, { Component } from "react";
import ReactDOM from "react-dom";

const initialTime = [25, 0];
const intialSessionTime = 25;
const initialBreakTime = 5;
const audio = new Audio('http://soundbible.com/mp3/Japanese Temple Bell Small-SoundBible.com-113624364.mp3');
const playPauseIcon = "https://cdn4.iconfinder.com/data/icons/essential-app-2/16/play-pause-music-player-512.png"
const resetIcon = "https://cdn4.iconfinder.com/data/icons/game-general-icon-set-1/512/reset-512.png"

class Pomo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'Session',
      time: initialTime,
      run: false,
      intervalId: '',
      sessionTime: intialSessionTime,
      breakTime: initialBreakTime
    }
  }
  
  runPause = () => {
    if(this.state.run === false) {
      this.runClock();
    }else if(this.state.run === true) {
      this.stopClock();
    }
  }
  
  runClock = () => {
    let intervalId = setInterval(this.clock, 1000);
    this.setState({run: true, intervalId: intervalId});
  }
  
  stopClock = () => {
    clearInterval(this.state.intervalId);
    this.setState({run: false});
  }
   
  clock = () => {
    let time = this.state.time.slice();
    time[1] = time[1]-1;
    
    if(time[1] < 0) {
      time = [time[0] - 1, 59];
    }
    this.setState({time});
    
    if(this.state.time[0] === 0 && this.state.time[1] === 0) {
      this.changeClockMode();
    }
  }
  
  changeClockMode = () => {
    this.stopClock();
    
    audio.play();
    
    if(this.state.mode === 'Session') {
      
      this.setState({time: [this.state.breakTime, 0], mode: 'Break'});
    }else if(this.state.mode === 'Break') {
      this.setState({time: [this.state.sessionTime, 0], mode: 'Session'});
    }
    
    this.runClock();
  }
  
  resetClock = () => {
    this.stopClock();
    
    this.setState({time: initialTime, sessionTime: intialSessionTime, breakTime: initialBreakTime});
  }
  
  changeClock = (i, targetId) => {
    if(this.state.run === true) {
      return
    }
    
    if(targetId === "s") {
      var sessionTime = this.state.sessionTime + i;
      if(sessionTime > 60 || sessionTime < 1) {
        return
      }
      this.setState({sessionTime})
    }else if(targetId === "b") {
      var breakTime = this.state.breakTime + i;
      if(breakTime > 60 || breakTime < 1) {
        return
      }
      this.setState({breakTime})
    }
    
    if(this.state.mode === "Session") {
      if(sessionTime !== undefined) {
        this.setState({time: [sessionTime, 0]});
      }
    }else {
      if(breakTime !== undefined) {
        this.setState({time: [breakTime, 0]})
      }
    }
    
  }
  
  incrementClock = (e) => {
    //alert(e.target.id[0])
    this.changeClock(1, e.target.id[0]);
  }
  
  decrementClock = (e) => {
    this.changeClock(-1, e.target.id[0]);
  }
  
  render() {
  
    let displayTime = [...this.state.time];
    
    displayTime[0].toString().length === 1 ? displayTime[0] = '0' + displayTime[0] : true;
    displayTime[1].toString().length === 1 ? displayTime[1] = '0' + displayTime[1] : true;
    
    
    return (
    <div id="clock-container"> 
      
        <div id="times">
          <div>
          <p className="p-second" style={{textAlign: "center"}}>Session Length</p>
          <div id="session">
            
            
            <button id="session-decrement" class="btn-change" onClick={this.decrementClock}><img id="s" class="down-arrow" src="https://cdn0.iconfinder.com/data/icons/typicons-2/24/arrow-down-thick-256.png" /></button>
      <p id="session-length" className="p-second"  style= {{marginTop:'10px'}}>{this.state.sessionTime}</p>
          <button id="session-increment" class="btn-change" onClick={this.incrementClock}><img id="s" class="up-arrow" src="https://cdn0.iconfinder.com/data/icons/typicons-2/24/arrow-up-thick-256.png"/></button>
            </div>
      
          </div>
          <div>
          <p className="p-second" style={{textAlign: "center"}}>Break Length</p>
          <div id="break">
            <button id="break-decrement" class="btn-change" onClick={this.decrementClock}><img id="b" class="down-arrow" src="https://cdn0.iconfinder.com/data/icons/typicons-2/24/arrow-down-thick-256.png" /></button>
      <p className="p-second" id="break-length" style= {{marginTop:'10px'}}>{this.state.breakTime}</p>
            <button id="break-increment" class="btn-change" onClick={this.incrementClock}><img id="b" class="up-arrow" src="https://cdn0.iconfinder.com/data/icons/typicons-2/24/arrow-up-thick-256.png"/></button>
            </div>
          </div>
          
          
        </div>
         <div style={{border: '8px solid', borderRadius: '10px', height: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
           <div id="time-mode"><p className="p-second">{this.state.mode}</p></div>
           <div id="time-left"><p className="p-second">{displayTime.join(":")}</p></div>
            </div>
        <div id="btn-control">
         
      <button id="start-stop" onClick={this.runPause}><img id="playPauseIcon" src={playPauseIcon} alt="Play pause icon"/></button>
      <button id="reset" onClick={this.resetClock}><img id="resetIcon" src={resetIcon} alt="Reset"/></button>
         
        </div>
    </div>
    )
  }
}

ReactDOM.render(<Pomo />, document.querySelector('#pomo'));