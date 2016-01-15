// Alter backbone so it looks for _id sey by mongodb instead of looking for id which is the backbone default
Backbone.Model.prototype.idAttribute = '_id';

/**
 * MODELS
 */
var Member = Backbone.Model.extend({
  defaults: {
    name: '',
    job_title: '',
    url: ''
  }
});


/**
 * COLLECTIONS
 */
var Members = Backbone.Collection.extend({
  url: 'http://localhost:3000/api/members'
});

//// instantiate two Members
//var member1 = new Member({
//  name: 'Jim Darlington',
//  job_title: 'Front End Developer',
//  url: 'http://jedarlington.co.uk'
//});
//
//var member2 = new Member({
//  name: 'Craig Perks',
//  job_title: 'Drupal Lead Developer',
//  url: 'http://www.craigperks.me.uk/'
//});

// instantiate a collection
var members = new Members();


/**
 * VIEWS
 */
//Backbone View for one member
var MemberView = Backbone.View.extend({
  model: new Member(),
  tagName: 'tr',

  initialize: function () {
    this.template = _.template($('.members-list-template').html());
  },

  events: {
    'click .edit-member': 'edit',
    'click .update-member': 'update',
    'click .cancel': 'cancel',
    'click .delete-member': 'delete'
  },

  edit: function() {
    this.$('.edit-member, .delete-member').hide();
    this.$('.update-member , .cancel').show();

    var name = this.$('.name').html();
    var job_title = this.$('.job-title').html();
    var url = this.$('.url').html();

    this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
    this.$('.job-title').html('<input type="text" class="form-control job-title-update" value="' + job_title + '">');
    this.$('.url').html('<input type="text" class="form-control url-update" value="' + url + '">');
  },

  update: function() {
    this.model.set('name', $('.name-update').val());
    this.model.set('job_title', $('.job-title-update').val());
    this.model.set('url', $('.url-update').val());

    this.model.save(null, {
      success: function(response) {
        console.log('Successfully updated blog with _id: ' + response.toJSON()._id);
      },

      error: function(response) {
        console.log('Failed to update member!');
      }
    });
  },

  cancel: function() {
    membersView.render();
  },

  delete: function() {
    this.model.destroy({
      success: function(response) {
        console.log('Successfully DELETED member with _id: ' + response.toJSON()._id)
      },

      error: function() {
        console.log('Failed to DELETE member!');
      }
    });
  },

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  }
});

// Backbone view for all members
var MembersView = Backbone.View.extend({
  model: members,
  el: $('.members-list'),

  initialize: function () {
    var self = this;

    this.model.on('add', this.render, this);

    this.model.on('change', function() {
      setTimeout(function() {
        self.render()
      }, 30);
    });

    this.model.on('remove', this.render, this);

    this.model.fetch({
      success: function(response) {
        _.each(response.toJSON(), function(item) {
          console.log('Successfully GOT member with _id: ' + item._id);
        });
      },

      error: function() {
        console.log('Failed to get members!');
      }
    });
  },

  render: function () {
    var self = this;

    this.$el.html('');

    _.each(this.model.toArray(), function (member) {
      self.$el.append((new MemberView({model: member})).render().$el);
    });

    return this;
  }
});

var membersView = new MembersView();


/**
 * jQuery
 */
(function($) {
  // Add member
  $('.add-member').on('click', function() {
    var member = new Member({
      name: $('.name-input').val(),
      job_title: $('.job-title-input').val(),
      url: $('.url-input').val()
    });

    $('.name-input, .job-title-input, .url-input').val('');

    members.add(member);

    member.save(null, {
      success: function(response) {
        console.log('Successfully saved member with _id: ' + response.toJSON()._id);
      },

      error: function() {
        console.log('Failed to save member!');
      }
    });
  });
})(jQuery);
