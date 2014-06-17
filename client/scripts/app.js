var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function () {
    $('.username').on('click', this.addFriend);
    $('#send .submit').on('submit', this.handleSubmit);
    // display messages from server
    this.fetch();
  },
  send: function (message, type) {
    type = type || 'POST';
    $.ajax({
      url: this.server,
      type: type,
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent.');
      },
      error: function (data) {
        console.log('chatterbox: Failed to send message.');
      }
    });
  },
  fetch: function(url) {
    var self = this;
    url = url || this.server;
    $.ajax({
      url: url,
      success: function (data) {
        console.dir(data);
        _.each(data.results, function (message, index, list) {
          console.log('typeof self.addMessage: ' + typeof self.addMessage);
          console.log('message:');
          console.dir(message);
          self.addMessage(message);
        })
      },
      error: function (data) {
        console.dir(data);
      }
    });
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  addMessage: function(message) {
    var htmlMessage = $('<p class="message"></p>').text(message.text);
    var username = $('<span class="username"></span>').text(message.username);
    htmlMessage.append(username);
    $('#chats').append(htmlMessage);
  },
  addRoom: function(room) {
    var htmlMessage = $('<div></div>').text(message.roomname);
    $('#roomSelect').append(htmlMessage);
  },
  addFriend: function(e) {
    e.preventDefault();
  },
  handleSubmit: function (e) {
    e.preventDefault();
  }
};

app.init();

