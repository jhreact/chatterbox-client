var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  currentRoom: 'all',
  init: function () {
    var self = this;
    $('.username').on('click', this.addFriend);
    //$('#send .submit').on('submit', this.handleSubmit);
    $('form').on('submit', self.handleSubmit.bind(self));
    $('#roomSelect').on('change', self.selectRoom(self));
    // display messages from server
    this.fetch();
    setInterval(self.fetch.bind(self), 2000);
  },
  selectRoom: function (self) {
    return function(e) {
      self.currentRoom = $(this).val();
    };
  },
  send: function (message, type) {
    type = type || 'POST';
    $.ajax({
      url: this.server,
      type: type,
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        $('#message').val('');
        console.log('chatterbox: Message sent.');
      },
      error: function (data) {
        console.log('chatterbox: Failed to send message.');
      }
    });
  },
  fetch: function(url) {
    var self = this;
    url = url || self.server + '?order=-createdAt';
    $.ajax({
      url: url,
      success: function (data) {
        var rooms = {};
        var $roomSelect = $('#roomSelect');
        console.dir(data.results);
        self.clearMessages();
        _.each(data.results, function (message, index, list) {
          // console.log('typeof self.addMessage: ' + typeof self.addMessage);
          // console.log('message:');
          // console.dir(message);
          rooms[_.escape(message.roomname)] = true;
          self.addMessage(message);
        });
        // retain selected roomname
        // clear out all other roomnames
        // add selected roomname to the rooms object
        // add 'all' option for all messages
        // app.currentRoom = 'all', by default
        // have listener .on('change') then app.currentRoom = [selected_room]
        $roomSelect.html('');
        rooms[self.currentRoom] = true;
        _.each(Object.keys(rooms).sort(), function (value, index, list) {
          //console.log($roomSelect);
          if (value === self.currentRoom) {
            $roomSelect.append('<option selected>' + value + '</option>');
          } else {
            $roomSelect.append('<option>' + value + '</option>');
          }
        });
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
    var roomname = _.escape(message.roomname);
    var htmlMessage = $('<p class="message"></p>');
    htmlMessage.text(message.text);
    htmlMessage.attr('data-roomname', roomname);
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
    console.log('inside handleSubmit');
    var message = {};
    var index = window.location.search.indexOf('=') + 1;
    var self = this;
    message.username = window.location.search.substring(index);
    message.text = $('#message').val();
    message.roomname = 'Area51';
    self.send(message);
  }
};

$(function() {
  app.init();
});

