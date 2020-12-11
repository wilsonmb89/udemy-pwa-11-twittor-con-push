var URLSafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json');
const fs = require('fs')
const webpush = require('web-push');
const subscriptions = require('./subs-db.json');

webpush.setVapidDetails(
  'mailto:wilsonmb1989@gmail.com',
  vapid.publicKey,
  vapid.privateKey
);

module.exports.getKey = () => {
  return URLSafeBase64.decode(vapid.publicKey);
}

module.exports.addSubscription = (subs) => {
  subscriptions.push(subs);
  fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(subscriptions));
};

module.exports.sendPush = (post) => {
  console.log(post);
  const pushedNot = [];
  subscriptions.forEach(
    (subs, i) => {
      const pushProm = webpush.sendNotification(subs, JSON.stringify(post)).catch(err => {
        if (err.statusCode === 410) {
          console.error('Error en indice:', i);
          subscriptions[i].delete = true;
        }
      });
      pushedNot.push(pushProm);
    }
  );
  Promise.all(pushedNot).then(
    res => {
      const filteredSubscriptions = subscriptions.filter(subs => !subs.delete);
      fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(filteredSubscriptions));
    }
  );
};
