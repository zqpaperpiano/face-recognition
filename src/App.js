import './App.css';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Navigation from './Components/Navigation/Navigation';
import Logo from './Logo/Logo';
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

const initialState ={
  input: '',
  previousURL: '',
  imageURL: '',
  box: {},
  route: 'signin',
  user: {
    id: '',
    name: '', 
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState(
      {
        user: {
          id: data._id,
          name: data.name, 
          email: data.email,
          entries: data.imageCount,
          joined: data.joinedDate
        }
      }
    )
  }


  calculateFaceLocation = (data) => {
    console.log('calculate face location');
    console.log(data);
    if(data === "No face identified"){
      toast("No face identified");
      return null;
    }else if(data === "Please enter a valid URL"){
      toast('Please enter a valid URL');
      return null;
    }else{
      // console.log('length of data: ', data.length);
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
    // console.log(width, height);

      var boxes = [];
      var i = 0;
      data.forEach((box) => {
        const oneBox = box.region_info.bounding_box;
        const newBox = {
          leftCol: oneBox.left_col * width,
          topRow: oneBox.top_row * height,
          rightCol: width - (oneBox.right_col * width),
          bottomRow: height - (oneBox.bottom_row * height)
        }
        boxes[i] = newBox;
        // console.log(boxes);
        ++i;
      })

      return boxes;
    }
    
  }

  displayFaceBox = (boxes) => {    
    if(boxes != null){
      const faceImage = document.getElementById("face-recognition");
      boxes.forEach((box) => {
      const topRow = `${box.topRow}px`;
      const bottomRow = `${box.bottomRow}px`;
      const rightCol = `${box.rightCol}px`;
      const leftCol = `${box.leftCol}px`;
      var newBox = document.createElement("div");
      newBox.setAttribute("class", "bounding-box");
      
      newBox.style.cssText=`position:absolute;top:${topRow};right:${rightCol};left:${leftCol};bottom:${bottomRow}`;
      faceImage.appendChild(newBox); 
    })
    }

  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value,
    })
  }

  onButtonSubmit = () => {
    if(this.state.previousURL != this.state.input){
      this.setState({
        previousURL: this.state.input,
        imageURL: this.state.input,
      })

    fetch('https://ziqing-face-recognition.onrender.com/imageurl', {
      method: 'post',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({
        url: this.state.input
      })
    })
    .then(resp => {
      console.log(resp);
      if(resp.status != 400){
        console.log('entering...');
        fetch('https://ziqing-face-recognition.onrender.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: this.state.user.email
          })
        })
        .then(count => {
          return count.json()})
        .then(count => {
          this.setState(Object.assign(
            this.state.user,
            {entries: count}
          ))
        })
        .catch(err => console.log('error'))
      }
      return resp.json();
    })
    .then(data => 
      {
        var divs = document.getElementsByClassName("bounding-box");
        // console.log(divs);
        if(divs.length > 1){
          // console.log('more than 1');
          var length = divs.length;
          // console.log('length: ', length);
          const image = document.getElementById("face-recognition");
          // console.log('current node before deletion: ', image.childNodes);
          for(var i = length ; i > 0; --i){
            image.removeChild(image.childNodes[i]);
          }
        }
        // console.log(data)
      this.displayFaceBox(
        this.calculateFaceLocation(
          data
        )
      )}
    )
    .catch(err => console.log(err))
  }
}

  onRouteChange = (route) => {
    if(route === 'signin'){
      this.setState(initialState)
    }

    this.setState({route: route})
  }

  render() {
    var route = this.state.route
    return(
      <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      {
        this.state.route === 'home'
        ? 
        <div>
          <Navigation onRouteChange={this.onRouteChange}/>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition imageURL={this.state.imageURL}/>
        </div>
        : (
          this.state.route === 'signin' 
          ? <SignIn onRouteChange = {this.onRouteChange} loadUser = {this.loadUser} />
          : <Register onRouteChange = {this.onRouteChange} loadUser={this.loadUser} />
        )
      }
      <ToastContainer />
    </div>
    );
  }
}

export default App;
