import React, {Component} from 'react';

import { Scene, Actions } from 'react-native-router-flux';
import crossroads from 'crossroads';

import LinkedRouter from './app/components/LinkedRouter';
import HomeScreen from './app/components/HomeScreen';
import GreetingScreen from './app/components/GreetingScreen';

const scenes = Actions.create(
    <Scene key="root">
        <Scene key="home" title="Home" component={HomeScreen} initial />
        <Scene key="greeting" title="Greeting" component={GreetingScreen} />
    </Scene>
);

crossroads.addRoute('greetings/{someone}', someone => Actions.greeting({ someone }));


export default class App extends Component {
  render() {

    return (
      <LinkedRouter scenes={scenes} scheme="thuy"/>
    );
	}
}