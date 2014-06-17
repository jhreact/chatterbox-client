var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  currentRoom: 'all',
  createdRooms: {},
  recipients: {},
  currentRecipient: '',
  init: function () {
    var self = this;
    $('.username').on('click', this.addFriend);
    $('#newMessage').on('submit', self.handleSubmit.bind(self));
    $('#roomSelect').on('change', self.selectRoom(self));
    $('#addRoom').on('submit', self.addRoom(self));
    $('#recipientSelect').on('change', self.selectRecipient(self));
    // display messages from server
    this.fetch();
    setInterval(self.fetch.bind(self), 2000);
  },
  selectRoom: function (self) {
    return function(e) {
      self.currentRoom = $(this).val();
    };
  },
  selectRecipient: function (self) {
    return function (e) {
      self.currentRecipient = $(this).val();
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
        self.setRecipients(data.results);
        self.clearMessages();
        _.each(data.results, function (message, index, list) {
          // console.log('typeof self.addMessage: ' + typeof self.addMessage);
          // console.log('message:');
          // console.dir(message);
          rooms[_.escape(message.roomname)] = true;
          if(self.currentRoom === 'all' || self.currentRoom === message.roomname) {
            self.addMessage(message);
          }
        });
        // retain selected roomname
        // clear out all other roomnames
        // add selected roomname to the rooms object
        // add 'all' option for all messages
        // app.currentRoom = 'all', by default
        // have listener .on('change') then app.currentRoom = [selected_room]
        // iterate over app.createdRooms and extend rooms obj with createdRooms
        _.extend(rooms, self.createdRooms);
        $roomSelect.html('');
        rooms['all'] = true;
        rooms[self.currentRoom] = true;
        _.each(Object.keys(rooms).sort(), function (value, index, list) {
          //console.log($roomSelect);
          if (value === self.currentRoom) {
            $roomSelect.append('<option selected value="' + value + '">' + value + '</option>');
          } else {
            $roomSelect.append('<option value="' + value + '">' + value + '</option>');
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
    if (self.currentRoom !== 'all') {
      message.roomname = self.currentRoom;
    }
    if (self.currentRecipient) {
      message.recipient = self.currentRecipient;
    }
    self.send(message);
  },
  addRoom: function (self) {
    // create an app property called createdRooms, a object to avoid duplication
    // when user creates a room using form, add to app.createdRooms
    return function (e) {
      e.preventDefault();
      self.createdRooms[$('#newRoomName').val()] = true;
      $('#newRoomName').val('');
    };
  },
  setRecipients: function (messages) {
    // iterate over messages
    //    create app level users storage object
    //    add user to storage object for each message
    var self = this;
    $recipientSelect = $('#recipientSelect');
    _.each(messages, function (value, index, list) {
      self.recipients[value.username] = true;
    });
    $('#recipientSelect').html('');
    _.each(Object.keys(this.recipients).sort(), function (value, index, list) {
      // maybe set currentUser app level variable
      if(value === self.currentRecipient) {
        $recipientSelect.append('<option selected value="' + value + '">' + value + '</option>');
      } else {
        $recipientSelect.append('<option value="' + value + '">' + value + '</option>');
      }
    });
  }
};

$(function() {
  app.init();
});

