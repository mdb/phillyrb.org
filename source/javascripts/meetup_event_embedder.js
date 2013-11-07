define('meetup_event_embedder', [
  'jquery',
  'meetup',
  'meetup_map_embedder'
], function (
  $,
  Meetup,
  MeetupMapEmbedder
) {
  var Embedder = function () {
    this.initialize();
  };

  Embedder.prototype.initialize = function (evtObj) {
    var self = this;

    self.template = $('#event-tmpl').html();
    self.container = $('article.next-event-information');
    self.meetup = new Meetup({
      sigId: 'TODO',
      sig: 'TODO'
    });
    self.meetup.events({
      success: function (data) {
        if (data && data.results) {
          self.embed(data.results[0]);
        }
      }
    });
  };

  Embedder.prototype.embed = function (evtObj) {
    var evt = this._eventData(evtObj),
        html = _.template(this.template, { event: evt });

    this.container.html(html)
    this.embedMap(evt);
  };

  Embedder.prototype.embedMap = function (evtObj) {
    new MeetupMapEmbedder(evtObj);
  };

  Embedder.prototype._eventData = function (evt) {
    return {
      name: evt.name,
      venueName: evt.venue_name,
      url: this._url(evt),
      mapUrl: this._getMapUrl(evt),
      time: this._formattedTime(evt.time),
      address: this._formattedAddress(evt),
      description: evt.description,
    };
  };

  Embedder.prototype._getMapUrl = function (evt) {
    var query = this._locationQuery(evt);

    return 'https://maps.google.com/?q=' + query + '&ll=' + evt.lat + ',' + evt.lon;
  };

  Embedder.prototype._locationQuery = function (evt) {
    var query = evt.venue_name + ',' + this._formattedAddress(evt) + '+' + evt.venue_zip;

    return query.replace(/\s/g, '+');
  };

  Embedder.prototype._formattedAddress = function (evt) {
    return evt.venue_address1 + ', ' + evt.venue_city + ', ' + evt.venue_state;
  };

  Embedder.prototype._formattedTime = function (time) {
    return moment(time).format('dddd, MMM Do, h:mm a');
  };

  Embedder.prototype._url = function (evt) {
    return 'http://meetup.com/Phillyrb/events/' + evt.id + '/';
  };

  Embedder.prototype._locationOq = function (venue) {
    var oq = venue.name + ' ' + venue.city.replace(/\s/g, '+');
    return oq.replace(/\s/g, '+').toLowerCase();
  };

  return Embedder;
});
