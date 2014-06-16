var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function () {},
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
    url = url || this.server;
    $.ajax({
      url: url
    });
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  addMessage: function(message) {
    var htmlMessage = $('<p></p>');
    htmlMessage.text(message.text);
    $('#chats').append(htmlMessage);
  }
};
