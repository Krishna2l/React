import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker'
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            show: false,
            mode: 'date'
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };
 toggleModal() {
        this.setState({showModal: !this.state.showModal});
        this.toggleModal();
    }

resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        else {
            if (Platform.OS === "android") {
              Notifications.createChannelAndroidAsync("notify", {
                name: "notify",
                sound: true,
                vibrate: true,
              });
            }
        }
        return permission;
    }
    
    async presentLocalNotification(date) {
       await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }
    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== "granted") {
          permission = await Permissions.askAsync(Permissions.CALENDAR);
          if (permission.status !== "granted") {
            Alert.alert("Permission not granted to show notification.");
          }
        }
        return permission;
      }
    
      async obtainCalendarId() {
        var calendar = null;
        if (Platform.OS === "ios") {
          calendar = await Calendar.getDefaultCalendarAsync();
        } else {
          const calendars = await Calendar.getCalendarsAsync();
          calendar = calendars
            ? calendars.find((cal) => cal.isPrimary) || calendars[0]
            : null;
        }
        return calendar ? calendar.id : null;
      }
    
    
      async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        const calendarId = await this.obtainCalendarId();
        const startDate = new Date(Date.parse(date));
        const endDate = new Date(Date.parse(date) + 2 * 60 * 60 * 1000);
        await Calendar.createEventAsync(calendarId, {
          startDate: startDate,
          endDate: endDate,
          title: "Con Fusion Table Reservation",
          timeZone: "Asia/Hong_Kong",
          location:
            "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong",
        });
      }

    handleReservation() {
         Alert.alert(
            'Your reservation OK?',
            'Number of guests: ' + this.state.guests + '\nSmoking? '+this.state.smoking + '\nDate and Time: '+this.state.date,
            [
            {text: 'Cancel', onPress: () => {this.resetForm()}, style: 'cancel'},
            {text: 'OK', onPress: () => {this.presentLocalNotification(this.state.date);
                this.addReservationToCalendar(this.state.date);
                this.resetForm();}},
            ],
            { cancelable: false }
        );
    }

    
      
    render() {
        return(
            <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
            <ScrollView>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Number of Guests</Text>
                <Picker
                    style={styles.formItem}
                    selectedValue={this.state.guests}
                    onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                </Picker>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                <Switch
                    style={styles.formItem}
                    value={this.state.smoking}
                    onTintColor='#512DA8'
                    onValueChange={(value) => this.setState({smoking: value})}>
                </Switch>
                </View>
                <View style={styles.formRow}>
      <Text style={styles.formLabel}>Date and Time</Text>
      <TouchableOpacity style={styles.formItem}
            style={{
                padding: 7,
                borderColor: '#512DA8',
                borderWidth: 2,
                flexDirection: "row"
            }}
            onPress={() => this.setState({ show: true, mode: 'date' })}
      >
          <Icon type='font-awesome' name='calendar' color='#512DA8' />
          </TouchableOpacity>   
      {/* Date Time Picker */}
      {this.state.show && (
          <DateTimePicker
              value={this.state.date}
              mode={this.state.mode}
              minimumDate={new Date()}
              
              minuteInterval={30}
              onChange={(event, date) => {
                  if (date === undefined) {
                      this.setState({ show: false });
                  }
                  else {
                      this.setState({
                          show: this.state.mode === "time" ? false : true,
                          mode: "time",
                          date: new Date(date)
                      });
                  }
              }}
          />
      )}
</View>
                    <View style={styles.formRow}>
                    <Button
                        onPress={() => this.handleReservation()}
                        title="Reserve"
                        color="#512DA8"
                        accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                </ScrollView>
             </Animatable.View>
            );
        }
    
    };

    const styles = StyleSheet.create({
        formRow: {
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          flexDirection: 'row',
          margin: 20
        },
        formLabel: {
            fontSize: 18,
            flex: 2
        },
        formItem: {
            flex: 1
        }
    });
    
    export default Reservation;