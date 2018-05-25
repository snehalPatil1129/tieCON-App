import populate from './dataGenerator'
import users from './raw/users'
import notifications from './raw/notifications'
import _ from 'lodash'

class DataProvider {

  getUser(id = 1) {
    return _.find(users, x => x.id == id);
  }

  getUsers() {
    return users;
  }

  getNotifications() {
    return notifications;
  }
  
  populateData() {
    populate();
  }
}

export let data = new DataProvider();