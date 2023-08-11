import './App.css';
import React from 'react';
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
          id: data.id,
          name: data.name, 
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }
      }
    )
  }


  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    return {
      leftCol: data.left_col * width,
      topRow: data.top_row * height,
      rightCol: width - (data.right_col * width),
      bottomRow: height - (data.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    // console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value,
    })
  }

  onButtonSubmit = () => {
    this.setState({
      imageURL: this.state.input,
    })

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({
        url: this.state.input
      })
    })
    .then(resp => {
      if(resp){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id,
          })
        })
        .then(count => count.json())
        .then(count => {
          this.setState(Object.assign(
            this.state.user,
            {entries: count}
          ))
        })
        .catch(err => console.log(err))
      }
      return resp.json();
    })
    .then(data => 
      this.displayFaceBox(
        this.calculateFaceLocation(
          data
        )
      )
    )
    .catch(err => console.log(err))
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
          <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
        </div>
        : (
          this.state.route === 'signin' 
          ? <SignIn onRouteChange = {this.onRouteChange} loadUser = {this.loadUser} />
          : <Register onRouteChange = {this.onRouteChange} loadUser={this.loadUser} />
        )
      }
    </div>
    );
  }
}

export default App;
