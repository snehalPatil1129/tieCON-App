import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";
import {Platform} from 'react-native';
import MyAgenda from './schedule/MyAgenda';
import EventCal from './schedule/EventCal';
import {Service} from '../../services';

export class ProgramsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tabs style={{ elevation: 3 }} style={styles.tabContent}>
        <Tab
          heading={
            <TabHeading  style={{backgroundColor : '#fff'}} >
              <Icon style={[styles.textColor]} name="calendar"/>
              <Text  style={[styles.textColor]} >Schedule</Text>
            </TabHeading>
          } style={styles.activeBorder}>        
          <EventCal navigation={this.props.navigation}/>
        </Tab>
        <Tab
          heading={
            <TabHeading style={{backgroundColor : '#fff'}}>
              <Icon  style={[styles.textColor]}  name="ios-link"/>
              <Text  style={[styles.textColor]} >My Agenda</Text>
            </TabHeading>
          } style={styles.activeBorder}>
          <MyAgenda navigation={this.props.navigation} />
        </Tab>
      </Tabs>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
  tabContent: {
    backgroundColor: '#FFFFFF',   
  },
  textColor : {
    color: '#ed1b24'
  },
  activeBorder:{
    borderColor: '#ed1b24',
  }
}));