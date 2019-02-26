import React, { Component } from "react";
import ReactDOM from "react-dom";

const initialTime = [25, 0];
const intialSessionTime = 25;
const initialBreakTime = 5;
const audio = new Audio('http://soundbible.com/mp3/Japanese Temple Bell Small-SoundBible.com-113624364.mp3');
const audioTick = new Audio('http://soundbible.com/grab.php?id=1580&type=mp3');
audioTick.loop = true;
const resetIcon = "https://cdn4.iconfinder.com/data/icons/game-general-icon-set-1/512/reset-512.png";
const playIcon = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-play-512.png";
const pauseIcon = "https://cdn3.iconfinder.com/data/icons/multimedia/100/pause-512.png";
const settingsIcon = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_settings_48px-512.png";
let iconPlay, iconPause;

class Pomo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'Session',
      time: initialTime,
      run: false,
      intervalId: '',
      sessionTime: intialSessionTime,
      breakTime: initialBreakTime,
      tickSound: 'On',
      alarmSound: 'On',
      settings: false
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
    this.state.tickSound === 'On' ? audioTick.play() : true;
    let intervalId = setInterval(this.clock, 1000);
    this.setState({run: true, intervalId: intervalId});
  }
  
  stopClock = () => {
    audioTick.pause();
    audioTick.currentTime = 0;
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
    
    this.state.alarmSound === 'On' ? audio.play() : true;
    
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
  
  tickSoundToggle = () => {
    if(this.state.tickSound === 'On') {
      this.setState({tickSound: 'Off'});
      audioTick.pause();
      audioTick.currentTime = 0;
    } else {
      this.setState({tickSound: 'On'});
      this.state.run === true ? audioTick.play() : true;
    }
  }
  
  alarmSoundToggle = () => {
    if(this.state.alarmSound === 'On') {
      this.setState({alarmSound: 'Off'});
      audio.pause();
      audio.currentTime = 0;
    } else {
      this.setState({alarmSound: 'On'});
      
    }
  }
  
  
  settingsToggle = () => {
    this.setState({settings: !this.state.settings});
  }
  
  render() {
  
    let displayTime = [...this.state.time];
    
    displayTime[0].toString().length === 1 ? displayTime[0] = '0' + displayTime[0] : true;
    displayTime[1].toString().length === 1 ? displayTime[1] = '0' + displayTime[1] : true;
    
    if(this.state.run === false){
      iconPlay = 'playIcon1';
      iconPause = 'pauseIcon2'
    }else {
       iconPlay = 'playIcon2';
      iconPause = 'pauseIcon1'
    }
    let display;
    this.state.settings === false ? display = 'none' : display = 'grid';
    return (
      
    <div id="clock-container"> 
        <button id="btn-settings" onClick={this.settingsToggle}>
        <img id="settingsIcon" src={settingsIcon} alt="Settings Icon"/>
          </button>
      <div id="settings" style={{display: display}}>
        <p>Tick sound:</p> <button onClick={this.tickSoundToggle}>{this.state.tickSound}</button>
        <p>Alarm sound:</p> <button onClick={this.alarmSoundToggle}>{this.state.alarmSound}</button>
  </div>
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
         
      <button id="start-stop" onClick={this.runPause}>
        <img src={playIcon} id={iconPlay} alt="Play icon"/>
          <img id={iconPause} src={pauseIcon} alt="Pause icon"/>
          </button>
      <button id="reset" onClick={this.resetClock}><img id="resetIcon" src={resetIcon} alt="Reset"/></button>
         
        </div>
    </div>
    )
  }
}

ReactDOM.render(<Pomo />, document.getElementById('pomo'));