var app = {
  init: function () {},
  send: function (message, type) {
    type = type || 'POST';
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
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
  fetch: function() {}
};
