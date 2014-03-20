//= require underscore
//= require inflection
//= require underscore.string
//= require underscore.extensions
//= require backbone

(function() {
  'use strict';
  var exports = this, tracker = _.namespace(exports, 'tracker');

  var exitors = {
    value: _.identity,

    hasChanged: function(views, options) {
      options = options || {};
      return _(views).any(function(view) {
        return view.views().hasChanged(options) || (view.hasChanged && view.hasChanged(options));
      });
    },

    save: function(views) {
      return $.when.apply(null, _.chain(views).map(function(view) {
        var deferreds = [];
        deferreds.push(view.views().save());

        if (view.save) {
          deferreds.push(view.save());
        }

        return deferreds;
      }).flatten().compact().value());
    },

    preventsSave: function(views) {
      return _(views).any(function(view) {
        return view.views().preventsSave() || (view.preventsSave && view.preventsSave());
      });
    },

    isValid: function(views) {
      return _(views).all(function(view) {
        return view.views().isValid() && (!view.isValid || view.isValid());
      });
    }
  };

  function merge(hash, key, arrayToMerge) {
    hash[key] = (hash[key] || []).concat(arrayToMerge);
    return hash;
  }

  var mutators = {
    pick: function(views) {
      var pickResult = {};

      _.each(_.rest(arguments), function(criteron) {
        if (!criteron) { return; }
        if(_.isString(criteron)) {
          merge(pickResult, criteron, _.clone(views[criteron]));
        }
        else {
          _.each(views, function(values, selector) {
            if(_.include(values, criteron)) {
              merge(pickResult, selector, criteron);
            }
          });
        }
      });
      return pickResult;
    },

    invoke: function(views, method) {
      _(views).chain().values().flatten().compact().invoke(method);
      return views;
    },

    $trigger: function(views, eventName, events) {
      _(views).chain().values().flatten().compact().invoke('$trigger', eventName, events);
      return views;
    }
  };

  _(['detach', 'render', 'remove']).each(function(method) {
    mutators[method] = function(views) {
      mutators.invoke(views, method);
      return views;
    };
  });

  function removeViewReference(originalViews, viewsToRemove) {
    _(viewsToRemove).each(function(views, key) {
      originalViews[key] = _(originalViews[key]).difference(views);
    });
  }

  function Views(parentView, views) {
    var self = {}, originalViews = views;
    views = views || {};

    var fn = {
      addView: function(selector, view) {
        if (arguments.length === 1) {
          view = selector;
          selector = '';
        }

        if (originalViews[selector]) {
          originalViews[selector] = originalViews[selector].concat(view);
        } else {
          originalViews[selector] = [view];
        }
        views[selector] = originalViews[selector];
        return self;
      },
      removeView: function() {
        self.remove();
        removeViewReference(originalViews, views);
      },
      attach: function() {
        _(views).each(function(values, selector) {
          var $selector = selector.length ? parentView.$(selector) : parentView.$el;
          $selector.append.apply($selector, _(values).chain().compact().pluck('el').value());
        });
        return self;
      },
      empty: function() {
        _(views).each(function(view, selector) {
          if (selector.length) {
            parentView.$(selector).empty();
          } else {
            parentView.$el.empty();
          }
        });
        return self;
      }
    };

    _(self).extend(fn);

    _(exitors)
      .chain()
        .extend(_(_).pick(['map', 'each', 'first', 'last', 'pluck', 'isEmpty', 'size', 'find', 'any']))
        .each(function(func, name) {
        self[name] = function() {
          var args = _(arguments).toArray();
          args.unshift(_(views).chain().values().flatten().compact().value());
          return func.apply(self, args);
        };
      });

    _(mutators).each(function(func, name) {
      self[name] = function() {
        var args = _(arguments).toArray();
        args.unshift(views);
        views = func.apply(self, args);
        return self;
      };
    });

    return self;
  }

  tracker.Views = Views;
}).call(this);
