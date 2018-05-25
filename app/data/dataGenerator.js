import users from './raw/users'
import notifications from './raw/notifications'
import _ from 'lodash'

function populateNotifications() {
  for (let notification of notifications) {
    let userId = notifications.indexOf(notification) % users.length;
    notification.user = _.find(users, x => x.id == userId) || users[0];
  }
}

let populate = () => {
  populateNotifications();
};

export default populate
