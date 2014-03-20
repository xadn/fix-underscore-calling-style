function hasChanged1(views, options) {
  options = options || {};
  return _(views).any(function(view) {
    return view.views().hasChanged(options) || (view.hasChanged && view.hasChanged(options));
  });
};

function hasChanged2(views, options) {
  options = options || {};
  return _(function() { return [1, 2, 3]; }).any(function(view) {
    return view.views().hasChanged(options) || (view.hasChanged && view.hasChanged(options));
  });
};

function hasChanged3(views, options) {
  options = options || {};
  return _.any(views, function(view) {
    return view.views().hasChanged(options) || (view.hasChanged && view.hasChanged(options));
  });
};