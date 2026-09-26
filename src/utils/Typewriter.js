function Typewriter(onConsume){
  var _this = this;

  this.queue = [];
  this.consuming = false;
  this.timmer = null;

  this.dynamicSpeed = function () {
    var speed = 2000 / _this.queue.length;
    return speed > 200 ? 200 : speed;
  };

  this.add = function (str) {
    if (!str) return;
    _this.queue.push.apply(_this.queue, str==='done'? [str] : str.split(''));
  };

  this.consume = function () {
    if (_this.queue.length > 0) {
      var str = _this.queue.shift();
      str && onConsume(str);
    }
  };

  this.next = function () {
    _this.consume();

    _this.timmer = setTimeout(function () {
      _this.consume();

      if (_this.consuming) {
        _this.next();
      }
    }, _this.dynamicSpeed());
  };

  this.start = function () {
    _this.consuming = true;
    _this.next();
  };

  this.done = function () {
    _this.consuming = false;
    clearTimeout(_this.timmer);
    onConsume(_this.queue.join(''));
    _this.queue = [];
  };
}

export default Typewriter